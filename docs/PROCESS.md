# Task 1

## Before coding

- Which parts of Task 7 can you reuse, and what changes for this app?
A lot of things. We're going to create a database in Supabase the same way, and use the same approach for the Prisma setup. Then the endpoints and their logic will be practically the same, except that here we'll have other roles and logic about what each role can do. We can reuse things like the seed logic, the validations, the normalized email logic, the difference between "there's no session" and "the session couldn't be checked", etc.

- How do MANAGER and FINANCE differ? Which differences are about permissions and which are about ownership of a record?
A manager requests approval to be able to make certain expenses, and FINANCE can approve or reject them. FINANCE can see the overall status, etc. Approving or rejecting expenses, recording collections and payments, and generating and approving settlements are about permissions: if you're FINANCE you can do it, and if not, you can't. Following their own entries, and seeing or not seeing other managers' artists, are about ownership: if it belongs to you, you can see it, and if not, you can't.

- How will you prevent signup from creating a privileged account?
Because when you sign up, the app directly assigns you the MANAGER role. Also, the role is never read from the body, the Zod validation removes the fields that aren't in the schema, the database has MANAGER as the default, and the only way to create a FINANCE account is the seed.

- In a real agency of around ten people, would public signup even make sense, or would accounts be created by someone? Say what you would do and why we are doing it this way for now.
This question is interesting, because if this app is going to be used by one company for now, we don't want just anyone to be able to sign up, since they would instantly become part of the company's app, even if only as a manager. From what I saw, I think we should only allow signing up through an invitation. I understand we're doing it this way now to practice the signup flow. But if signup stays open, what we should probably do is add a multi-tenant system, so anyone who signs up would have to create their own company or receive an invitation to one.

- Two roles or three? The product notes settle on two for v1. Say whether you agree and what a third would be for.
Two roles for now. But if we add invitations, we need someone to create and remove users, manage roles, etc., so an ADMIN who, besides being able to do what FINANCE and MANAGER do, also has access to all of this. For example, someone from FINANCE we want to give all this power to could directly be an ADMIN.