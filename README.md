
# Chat application - final project

*The aim of this project is to create a simple Chat web application, allowing its users to create and access channels, send and receive messages.*

## Usage

*How to start and use the application, run the tests,...*

* Clone this repository, from your local machine:
  ```
  git clone https://github.com/miriambenallou/tech_web.git webtech
  cd webtech
  ```
* Install [Go](https://golang.org/) and [Dex](https://dexidp.io/docs/getting-started/). For example, on Ubuntu, from your project root directory:   
  ```
  # Install Go
  apt install golang-go
  # Download Dex
  git clone https://github.com/dexidp/dex.git
  # Build Dex
  cd dex
  make
  make examples
  ```
  Note, the provided `.gitignore` file ignore the `dex` folder.
* Register your GitHub application, get the clientID and clientSecret from GitHub and report them to your Dex configuration. Modify the provided `./dex-config/config.yml` configuration to look like:
  ```yaml
  - type: github
    id: github
    name: GitHub
    config:
      clientID: xxxx98f1c26493dbxxxx
      clientSecret: xxxxxxxxx80e139441b637796b128d8xxxxxxxxx
      redirectURI: http://127.0.0.1:5556/dex/callback
  ```
* Inside `./dex-config/config.yml`, the frond-end application is already registered and CORS is activated. Now that Dex is built and configured, your can start the Dex server:
  ```yaml
  cd dex
  bin/dex serve ../dex-config/config.yaml
  ```
* Start the back-end
  ```bash
  cd back-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Optional, fill the database with initial data
  bin/init
  # Start the back-end
  bin/start
  ```
* Start the front-end
  ```bash
  cd front-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Start the front-end
  yarn start
  ```

## Author

*Pierre Herduin, e-mail : pierre.herduin@edu.ece.fr*
*Miriam Benallou, e-mail : miriam.benallou@edu.ece.fr*
*SI, Group 1*

## Tasks

Project management

* Naming convention   
  *The naming convention was made by respecting the good practices of JavaScript ES6.*
* Project structure  
  Here is the structure of our project :

      ```
      back-end/
        bin/
        db/
        lib/
        test/
        ...
      front-end/
        public/
        src/
          channel/
          icons/
          ...
        <Other configuration files like: package.json>
      dex/
      dex-config/
      README.md
      ...
      ```
  *This web application project is structured in three parts, the back-end responsible for storing and managing data and the front-end, responsible for the direct interactions with the users. And the dex server, that deals with the third-part authentication.*
* Code quality   
  *Throughout the project, we did our best to produce a code of good quality and correctly indented.*
* Design, UX   
  *Use of React UI framework MaterialUI. The design was thought to be as intuitive as possible, and to meet the user's needs. We followed the user experience principles to make it accessible and consistent.*
* Git and DevOps   
  *We used GitHub as a versioning tool, to manage the project.*

Application development

* Sign-in form & account creation
  *When lauching the web application, the user can register and login without using Oauth.*
* Welcome screens   
  *We consider there are two welcome screens in this project. The first one is the one when you launch the application. The user has the choice to login via Oauth or via a regular no-Oauth identification. He has the choice to create an account if he doesn't already have one. The second one is when the user logs in. The header is changed with the addition of log-out and home icons, and the user's gravatar. The page contains relevant information about the user:  number of channels he created, total number of channels in which he's a member, e-mail address.*
* New channel creation   
  *The user has the possibility to create a new channel. He can access the channel creation through a button on top of the channels list, or through the welcome page. After choosing the channel name and its members via a pop-up Dialog, the user validates his choices and the new channel is created in the back-end.*
* Channel membership and access   
  *The user only has access the channels in which he's a member. The creator of the channel can delete it, and add other members to the group chat. The creator is also in the list of members. Other users don't have access to these functionalities.*
* Ressource access control   
  *Every request is secured with access tokens verification. This is true for the Oauth users and Non-Oauth users.*
* Invite users to channels   
  *Inviting users to channels is possible when creating or modifying a channel, through a Popup Dialog. The creator of the channel is the only one that can delete the channel, change its name, invite users.*
* Message modification   
  *The sender can modify his messages. The message modification is accessible through an icon in the message bubble. On click, a pop up appears allowing the user to modify the message.*
* Message removal   
  *The same rules as modification apply for message removal.*
* Account settings   
  *The user has access to his account settings via the header, by clicking on his gravatar, or via the welcome page. This includes his name, email address, language and gravatar preferences.*
* Gravatar integration   
  *Gravatars were integrated in our web application by using the react-gravatar component. If the gravatar doesn't already exist, the user has a default monsterid gravatar.*
* Avatar selection   
  *The user has the possibility to choose between a selection of gravatars in his account settings.*
* Personal custom avatar   
  *place your comments*
