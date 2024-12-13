# Project V
Project V is a livestreaming application dedicated to VTubers that supports multistreaming, allowing you to watch four streams at once.

## Initial Setup
Download the project from the [repository](https://github.com/JunJie-Lai/Project-V) and unzip it into the desired location.

Next open a terminal in the project directory where you will see all of the project files including `ngrok.exe` and `README.md`.
* We recommend [Visual Studio Code](https://code.visualstudio.com/download) as it has a built in terminal when opening the project.

Make a copy of `env.sample` in the project directory and rename it to `.env`.

## MySQL

Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/ "MySQL Community Server")
* Follow the installation and server configuration

Download and install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (Optional)
* Recommended as a database GUI for making the next step easier.

Modify the `DATABASE_URL` field in `.env`.
* [Documentation](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-mysql "Documentation")
* Format: `DATABASE_URL = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"`
  * USER: The name of your database user
  * PASSWORD: The password for your database user
  * PORT: The port where your database server is running (typically 3306 for MySQL)
  * DATABASE: The name of the database
* Example: `DATABASE_URL="mysql://root:randompassword@localhost:3306/mydb"`

In the terminal initialize the database with the commands:
* `prisma db push`
* `prisma generate`

`prisma studio` can be used to check the database if needed.

## Ngrok

Create your [Ngrok](https://ngrok.com/) account, in your dashboard:

* Follow the instruction in [Setup & Installation](https://dashboard.ngrok.com/get-started/setup).
* Navigate to [Domains](https://dashboard.ngrok.com/cloud-edge/domains):
    1. Select "New Domain".
    2. Keep note of the Domain URL

## Clerk

Create your [Clerk](https://clerk.com/) account and a new application/project.
* Application name can be Project V or a name of your choice on the login menu.
* Email and Google should be enabled for Sign in options.

In your dashboard on the Configure tab:
* Navigate to "API Keys" on the sidebar, copy your Publishable keys and Secret keys to
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
* Navigate to "Webhooks" on the sidebar:
    1. Select "Add Endpoint".
    2. Endpoint URL: https:// + Your Ngrok domain URL + /api/webhooks/clerk
    3. Subscribed Events: user.created, user.deleted, user.updated
    4. Select "Create".
    5. Once created, copy your "Signing Secret" to `CLERK_WEBHOOK_SECRET`.

**IMPORTANT:** Ensure that the webhook endpoint is always enabled as it may disable itself sometimes, causing user sign-ups to not register in the database.

Navigate to "Email, phone, username" on the sidebar:
* You can toggle how Clerk handles account creation, where we recommend:
  * Enable email address and make it optional.
  * Enable username and make it required.
  * Password is enabled.
  * Allow users to delete their accounts.

Navigate to "Paths" on the sidebar and under Component Paths:
* Ensure that Sign-in, Sign-up, and User Button are set to "Page on development host".
* Prevents Clerk from improperly redirecting you after signing-up.

## LiveKit

Create your [LiveKit](https://livekit.io/) account and project, in your dashboard:
* Navigate to "Settings" on the sidebar:
    1. Select "KEYS" -> "Other Keys" -> "Create key" -> "GENERATE".
    2. Copy your "WEBSOCKET URL" to `NEXT_PUBLIC_LIVEKIT_URL`, "API KEY" to `LIVEKIT_API_KEY` and "SECRET KEY" to
       `LIVEKIT_API_SECRET`.
    3. Select "WEBHOOKS" -> "ADD NEW ENDPOINT".
    4. URL: https:// + Your Ngrok domain URL + /api/webhooks/livekit

## UploadThing

Create Your [UploadThing](https://uploadthing.com/) account and "Create a new app", in your dashboard:
* Navigate to "API Keys" on the sidebar:
    1. "Create key" if not created.
    2. Copy your Secret key and App ID to `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`.

## Deployment
In the project terminal, do `npm install next` to install the Next.js dependency.

Then, run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

After `npm run dev`, to deploy the project to others:
* Open `ngrok.exe` in the project directory.
* In the Ngrok terminal, run the command:
```bash
ngrok http --domain="Your Ngrok Domain URL" 3000
```

Use Ctrl + C to exit deployment for both the project terminal and Ngrok's terminal.

## OBS
To try out livestreaming, download [OBS](https://obsproject.com).
Refer to the [Quick Start Guide](https://obsproject.com/kb/quick-start-guide) on how to use OBS to setup your capture settings.

When signed in for the project website:
* Navigate to the "Dashboard".
* Navigate to "Keys" on the side.
* Click on "Generate Connection" which will generate a Server URL and Stream Key that will be connected with OBS.

On OBS, go to "Settings" and then "Stream":
* Copy and paste the Server URL and Stream Key on the site into `Server` and `Stream Key` on OBS.
* Save by clicking "Apply".

Now you can press "Start Streaming" on OBS and it should show your stream feed on the signed-in user.
