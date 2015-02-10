---
layout: post
title: Customising Bootstrap with Meteor
comments: false
tags: [ meteor, bootstrap ]
---
<!--<style type="text/css">
  .gist-file
  .gist-data {max-height: 300px;}
</style>-->

This is a self reflection post that aims to cover a step by step instruction on how to do a simple meteor web site. Other than basic html and javascript knowledge, there is nothing much more to know. This will later be extended to various other features like converting it into an android application and etc. Start off by creating a meteor project.

{% highlight js %}
> meteor create fusecam
{% endhighlight %}

This creates a basic project, with the basic components. There is actually a hidden file which is the .meteor which contains all the package information and etc. It is important to take note here that the packages are loaded in the order it is defined in the .meteor/package. For now, we will only care about the front end. In order to simplify the development of the front end several packages will be installed. They they are listed below.

These output is obtained using  the meteor list command.

{% highlight js %}
$ meteor list
{% endhighlight %}


{% highlight js %}
accounts-password            1.0.6  Password support for accounts
autopublish                  1.0.2  Publish the entire database to all clients
ian:accounts-ui-bootstrap-3  1.2.25  Bootstrap-styled accounts-ui with multi-language support.
insecure                     1.0.2  Allow all database writes by default
iron:router                  1.0.7  Routing specifically designed for Meteor
less                         1.0.12  The dynamic stylesheet language
meteor-platform              1.2.1  Include a standard set of Meteor packages in your app
nemo64:bootstrap             3.3.1_1  Highly configurable bootstrap integration.
{% endhighlight %}

Once again it is important to take note here that the order of the packages will matter and this is often the cause of complications at times and it will be time consuming to wonder what went wrong. The easiest way is to view the file.


{% highlight js %}
jianmba:fusecam Jian$ cat .meteor/packages
# Meteor packages used by this project, one per line.
# Check this file (and the other files in this directory) into your repository.
#
# 'meteor add' and 'meteor remove' will edit this file for you,
# but you can also edit it by hand.

meteor-platform
autopublish
insecure
iron:router
accounts-password
nemo64:bootstrap
less
ian:accounts-ui-bootstrap-3
{% endhighlight %}

Now lets try to make a basic layout for this purpose. At the moment the folder structure does not really matter but it is good to pay good attention how on to structure the meteor application. I am going to use a few packages to simpify this process. The first is the iron:router package which will handling all the routing and layout and it is far superior compared to basic engine for layout and routing purposes.

For now, I am only interested to create a single page which is the home or index page. As per usual the page should consist of the 3 main elements, the navigation bar, the contents and the footer. For those who developed things in ASP.NET and are used to Master pages, Iron Router layout template engine handles this. Basically

<!-- {% gist JianLoong/f63eebe760663bf1bb53 %} -->

{% highlight js %}
Router.route('/', function () {
  this.render('/index');
});
 
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});
{% endhighlight %}

Now, we will proceed to create the files which will be used in our application which are the navbar.html, header.html, footer.html, application_config.html. Please note that meteor does not care what you name the files. However it is good to have a good naming convention.

The yield field is important.

Besides that I will also go ahead and use a basic navigation bar from the bootstrap website. It doesn't matter which navigation you select as all of them should be properly displayed.


Now we will proceed to configure the css files and etc. This will be done by only customising the needed components for our site and disabling and enable components as we go.

Thus we will edit the custom.bootstrap.json. By default all the components are disabled, since we are only interested in the select few components for this navigation bar, only those will be enabled. In order for the site to be responsive it is important that the responsive elemnts are enabled.

The end file should look something like this.


What we have now is the default bootstrap look and feel. The current look is obviously very dull and so we will now improve it. Basically this can be done by changing the variables at the custom.bootstrap.import.less. However we do not want to be doing this as I am no where near an expert in the usage of colours and such. I will take an easier approach instead.

Head over to [bootswatch](http://www.bootswatch.com) and find a theme you like. Now I will copy the variables used in one of these templates for my site. Notice that the import is added on line 4 without this an error will be thrown.



Navbar

![Navigation Bar](/public/img/navbar.png)

Often times, it is good to have navigation bar which states which page the user is currently at. This is easily done in Meteor by the addition of a simple package which is the iron-router-active package from zimme. This active colour is default from the bootstrap template and can be changed if needed.

{% highlight js %}
$ meteor add zimme:iron-router-active
{% endhighlight%}

After that, we will just add 

Comments are disabled.


