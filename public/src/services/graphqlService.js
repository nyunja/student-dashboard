export class GraphQLService {
    constructor() {
        this.endpoint = "https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql"
        // this.token = localStorage.getItem('jwt') || null;
    }

    async query(queryStr, variables = {}) {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: queryStr,
                    variables,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data.data;
        } catch(error) {
            console.error('GraphQL query error: ', error);
            throw error;
        }
    }

    async getUserInfo() {
        const query = `
            {
                user {
                    id
                    login
                    email
                    attrs
                    auditRatio
                    
                }
                transaction(where: { eventId: { _eq: 75 } }, order_by: {createdAt: desc}) {
                    amount
                    createdAt
                    path
                    type
                }
                progress {
                    grade
                }
                
            }
        `;
        return this.query(query);
    }

    async getUserXP() {
        const query = `
            {
                transaction( where: { _and: [{ type: { _eq: "xp" } }, { eventId: { _eq: 75 } }]}) {
                    path amount type createdAt
                }
            }
        `;
        return this.query(query);
    }

    async getCompletedExercises(userId, eventId = 75) {
        const query = `
        query GetCompleted($userId: Int!, $eventId: Int!) {
            pendingProgress: progress(
                where: { isDone: { _eq: true }, eventId: { _eq: $eventId }, userId: { _eq: $userId }, id: { _neq: 145124 } }
            ) {
                createdAt path
            }
        }`;
        return this.query(query, { userId, eventId });
    }

    async getUserSkills() {
        const query = `
        {
            user {
                id
                skills: transactions(
                    where: { type: { _like: "skills_%" } }
                    order_by: { amount: desc }
                ) {
                    type amount
                }
            }
        }
        `;
        return this.query(query);
    }    
}