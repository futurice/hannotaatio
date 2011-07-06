[Hannotaatio](https://hannotaatio.futurice.com) - A visual website feedback tool
================================================================================

Hannotaatio is a visual website feedback tool which allows the website users to draw on the website and share the annotated website with the developers.

Go to [https://hannotaatio.futurice.com](https://hannotaatio.futurice.com) and try out the live demos.

Install Hannotaatio to your website
-----------------------------------

Go to [https://hannotaatio.futurice.com](https://hannotaatio.futurice.com) for installation instructions.

Setting up your own Hannotaatio instance
----------------------------------------

1. `git clone git@github.com:futurice/hannotaatio.git`
2. `cd hannotaatio`

3. `cp config/keys.yml.tmpl config/keys.yml`
4. `cp config/database.yml.tmpl config/database.yml`

5. Open the config/keys.yml file and edit:
   * Amazon Web Service credentials
   * secret_token (see "Generate secret token")

6. Open the config/database.tmpl file and edit it to correspond your own database setup

7. `cd bin`
8. `sh build.sh`
9. `cd ..`

10. `rails server`

11. Open your browser and go to [http://localhost:3000](http://localhost:3000)

Local testing
-------------

The Hannotaatio snippets in your local instance (http://localhost:3000) are pointing to production API https://hannotaatio.futurice.com.

To test your local API you can use the two example sites:

* [http://localhost:3000/demos/customer_example2/index-local.html](http://localhost:3000/demos/customer_example2/index-local.html)
* [http://localhost:3000/demos/customer_example5/index-local.html](http://localhost:3000/demos/customer_example5/index-local.html)

Notice that instead of using _index.html_ you should use _index-local.html_ for you local testing since those files have been configured to use the API running at localhost:3000. Feel free to modify the `_hannotaatioPreferences` on the index-local.html files.

Generating secret token
-----------------------

The _secret_token_ is a 128-character string. You can use IRB (Interactive Ruby Shell) to generate the secret_token:

`irb`

`>> require 'active_support'`

`>> ActiveSupport::SecureRandom.hex(64)` 

On local development environment the `secret_token` is optional.

Authors
-------

Hannotaatio was made as a school project for a [Software Development Project](http://www.soberit.hut.fi/T-76.4115/) course at [Aalto University](http://www.aalto.fi/). The project was sponsored by [Futurice](http://www.futurice.com). 

**Developers**

*   [Mikko Koski](https://github.com/rap1ds) (Aalto University student, Futurice employee)
*   Marja Käpyaho (Aalto University student, Futurice employee)
*   [Antti Vuorela](https://github.com/vugi) (Aalto University student, Futurice employee)
*   Martin Richter (Aalto University student, Futurice employee)
*   Kim Dikert (Aalto University student)
*   Yu Shen (Aalto University student)

**Product owner**

*   Ville Saarinen (Futurice)