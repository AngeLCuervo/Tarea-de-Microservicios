// Mock database representing DynamoDB for the Serverless architecture
const posts = [];
const users = new Map();

exports.getStream = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(posts.sort((a, b) => b.createdAt - a.createdAt)),
    };
};

exports.createPost = async (event) => {
    try {
        const body = JSON.parse(event.body);
        if (!body.content || body.content.length > 140) {
            return { statusCode: 400, body: JSON.stringify({ message: "Content must be <= 140 characters" }) };
        }

        const auth0Id = event.requestContext.authorizer.jwt.claims.sub;
        if (!users.has(auth0Id)) {
            return { statusCode: 403, body: JSON.stringify({ message: "User must be synced first" }) };
        }

        const newPost = {
            id: Date.now().toString(),
            username: users.get(auth0Id).username,
            content: body.content,
            createdAt: new Date().toISOString()
        };

        posts.push(newPost);

        return {
            statusCode: 201,
            body: JSON.stringify(newPost),
        };
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error" }) };
    }
};

exports.getCurrentUser = async (event) => {
    const claims = event.requestContext.authorizer.jwt.claims;
    const auth0Id = claims.sub;

    if (!users.has(auth0Id)) {
        users.set(auth0Id, {
            auth0Id: auth0Id,
            username: claims.nickname || auth0Id,
            email: claims.email
        });
    }

    return {
        statusCode: 200,
        body: JSON.stringify(users.get(auth0Id)),
    };
};
