[Hannotaatio](https://hannotaatio.futurice.com) - A visual website feedback tool
================================================================================

Hannotaatio is a visual website feedback tool which allows the website users to draw on the website and share the annotated website with the developers.

Go to [https://hannotaatio.futurice.com](https://hannotaatio.futurice.com) and try out the live demos.

Install Hannotaatio to your website
-----------------------------------

Go to [https://hannotaatio.futurice.com](https://hannotaatio.futurice.com) for installation instructions.

Setting up your own Hannotaatio instance
----------------------------------------

**Requirements**

* Ruby 1.9.2
* Rails 3.0.8
* Amazon AWS account for S3 and SES (optional)

**Installation steps**

1. `git clone git://github.com/futurice/hannotaatio.git`
2. `cd hannotaatio`

3. `bundle install`

4. `cp config/keys.yml.tmpl config/keys.yml`
5. `cp config/database.yml.tmpl config/database.yml`
6. `cp config/environments/development.rb.tmpl config/environments/development.rb`

7. (Optional) Open the config/keys.yml file and edit:
   * secret_token (random string, minimum length of 30 characters)
   * Amazon Web Service credentials

8. (Optional) Open the config/database.tmpl file and edit it to correspond your own database setup

9. (Optional) Open environment config files config/environments/*.rb and edit them to correspond your own setup.

10. `cd bin`
11. `sh build.sh`
12. `cd ..`

13. `bundle exec rake db:migrate`

14. `rails server`

15. Open your browser and try out the example sites e.g. [http://localhost:3000/demos/customer_example2/index-local.html](http://localhost:3000/demos/customer_example2/index-local.html)

**Troubleshooting**

**Q:** I get an "invalid byte sequence in US-ASCII (ArgumentError)" error

**A:** You need to set your system's locale to support UTF8:

    export LC_ALL=en_US.UTF-8
    export LANG=en_US.UTF-8`


Local testing
-------------

The Hannotaatio snippets in your local instance (http://localhost:3000) are pointing to production API https://hannotaatio.futurice.com.

To test your local API you can use the two example sites:

* [http://localhost:3000/demos/customer_example2/index-local.html](http://localhost:3000/demos/customer_example2/index-local.html)
* [http://localhost:3000/demos/customer_example5/index-local.html](http://localhost:3000/demos/customer_example5/index-local.html)

Notice that instead of using _index.html_ you should use _index-local.html_ for local testing since those files have been configured to use the API running at localhost:3000. Feel free to modify the `_hannotaatioPreferences` on the index-local.html files.

Running tests
-------------

**Backend unit tests**

`bundle exec rake test`

**Frontend unit tests**

Browse to [http://localhost:3000/tests/](http://localhost:3000/tests/)

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
*   Maksim Luzik (Aalto University student)
*   Peter Lunberg (Aalto University student)

**Product owner**

*   Ville Saarinen (Futurice)