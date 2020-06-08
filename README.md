
# howto-react-realtime

![](readme.gif)

This is the code of a lesson i did recently on realtime interfaces, and in particular on how i create realtime web apps with the help of various components.

This code implements an online version of the ping game, playable by multiple users at the same time. The following components are used to compile and run the frontend (i.e. the user interface) and the backend:
* Frontend script:
  * React: a Javascript library that allows to build interfaces whose appearance depends only on a single object (the <i>state</i>)
  * websocket: an API provided by most browsers that allows to establish permanent bidirectional connections with a server
  * Babel: converts modern Javascript code into compatible code that can be run on most browsers
  * Webpack: allows to convert JSX (a mix of JS and HTML) into JS, and to pack both the code and its dependencies into a single JS file.
* Frontend style:
  * SASS: an extension of CSS that introduces additional functionalities, such as nesting and variables
  * PostCSS: converts SASS and CSS into CSS that is compatible with most browsers
* Server
  * Node: a standalone Javascript interpreter, that allows to build software with Javascript
  * Koa: an HTTP server for Node
  * wss: a Websocket library for Node


## Installation

1. Install docker-ce by following the instructions for Ubuntu or Windows:
   * https://docs.docker.com/engine/install/ubuntu/
   * https://docs.docker.com/docker-for-windows/install/

2. Download the repository, open a terminal in its folder and run:
   ```
   docker build . -t temp && docker run --rm -it -p 8080:8080 temp
   ```

3. Visit
   ```
   http://localhost:8080
   ```
