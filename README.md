<br /><br />

<p align="center">
<a href="https://torqbit.com/torq">
  <img src="public/icon/torq-long.svg" alt="Torq Logo" width="180">
</a>
</p>

<!-- <h3 align="center"><b>Torqbit</b></h3> -->
<p align="center"><b>An all-in-one open source platform for selling courses online</b></p>

<p>
    <a href="https://github.com/torqbit/torq" target="_blank">
      <img
        src="screenshots/screenshot-torq.png"
        alt="Course management screen"
        width="100%"
      />
    </a>
</p>

Meet [Torq](https://github.com/torqbit/torq). An open-source learning platform to manage your courses.

The easiest way to get started with Torq is by installing in your local machine.

## 🍙 Self Hosting

### Prerequisite

Development system must have docker engine installed and running.

### Steps

Setting up local environment is extremely easy and straight forward. Follow the below step and you will be ready to contribute

1. Clone the code locally using `git clone https://github.com/torqbit/torq`
1. Switch to the code folder `cd torq`
1. Edit the `docker-compose.yml` file to include the Google & Github client credentials, and the email id that will be the admin for the platform.
1. Now run the command `docker-compose up` to launch the web app and the MySQL server.

You are ready to play around the platform. Do not forget to refresh the browser (in case id does not auto-reload)

Thats it!

## 🚀 Features

- **Manage Courses**: Create courses with video lessons.
- **Video Streaming**: Stream your course videos, which are powered by Bunny.net
- **Tracking Learning Progress**: Monitor learning progress with detailed analytics, enabling learners and instructors to assess skill development and mastery.
- **Course Discussion**: Foster collaboration and engagement through course-specific discussion forums, facilitating knowledge sharing and peer interaction.
- **Alert Comment Notification**: Enable timely communication by alerting users to new comments and replies to queries, enabling greater engagment.

## 💻 Development environment setup

### Getting Started

First need to add .env file with some credentials:

```bash
# Next ENV
NODE_ENV=development
NEXT_PUBLIC_SECRET=uPijyPl163ihk570sksueTQrNMnKW4
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET = uPijyPl163ihk570eXbQrNMnKW4
NEXT_PUBLIC_APP_ENV=development

# Admin details
ADMIN_EMAIL=admin@email.com


# DB Credentials
DATABASE_URL="mysql://torqbit:passw0rd@0.0.0.0/torqdb"


# Google Auth Credentials
GOOGLE_ID=******************.apps.googleusercontent.com
GOOGLE_SECRET=******************

# GitHub Auth Credentials
GITHUB_ID=******************
GITHUB_SECRET=******************

```

### Installing Packages

Using npm:

```bash
$ npm install
```

Using yarn:

```bash
$ yarn install
```

Then, you can run locally in development mode with live reload:

Using npm:

```bash
$ npm dev
```

Using yarn:

```bash
$ yarn dev
```
