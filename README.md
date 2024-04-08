# Bot Setup

To setup the Discord bot you'll need:
- A Discord account
- A Discord server where you have permissions to add bots
- Node.js installed on your system

After doing this, your ready to run the bot with these steps:

- Create a Discord application and use it's ID in your env file (Keep this ID secret).
- Install the node packages using `npm install`
- After installing the packages the bot is ready to run using `node index.js`
- Invite the bot with administrator rights to your server using the "OAuth2" tab in the Discord Developer Portal.

# Database process (Supabase with DrizzleORM)

Supabase is an open-source Firebase alternative that uses a PostgreSQL database. We are using DrizzleORM to easily interact with our database and utilize migrations

To add a schema, follow these steps:
- Create a file in `/src/schemas/PLURAL_SCHEMANAME.js`
- Define the fields using DrizzleORM notation [Documentation](https://orm.drizzle.team/docs/column-types/pg)
- Run `npm run generate` to generate the migration for the new or altered database. Some questions may pop up about the changes.
- Run `npm run migrate` to run the database migrations. 

After doing this, your schema is ready to be used. Write your [queries](https://orm.drizzle.team/docs/rqb) in the same schema file and call them wherever you need. 
 
