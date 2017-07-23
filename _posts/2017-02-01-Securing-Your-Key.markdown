---
layout: post
title:  "Securing Sensitive Information in an Application"
description: "The way to secure sensitive information in your application"
date:   2017-02-01 08:30:03
categories: Backend/Security
id: securing_application
comments: true
---

# Background

Security one of the primary concern of any application. It should never be compromized. Recently I was working on project where I have to manage multiple keys and sensitive information. In most cases we save these information in settings or config files. In some cases people prefer to use enviromental variable and export keys before running application. 

When sensitive information is saved in an unencrypted file or exported as environmental variable application become vulnerable to simple attacks. The problem is more severe when we are using source management and everyone in organization can access git repository of the application.

# How to Secure Sensitive Information

There are different ways that can be used to secure sensitive information. Here is one of the way

1. Create a RSA key pair. Store key files in some secure place that can be accessed from only whitelisted IP addresses
2. Create an AES secret key, encrypt it with public key of RSA key pair and store the encrypted secret key in some persistent storage
3. Encrypt all sensitive information with AES secret key and then store them on any persistent storage
4. Whenever any piece of code need to access senstive information, load that information from storage decrypt the information using AES secret key and then use it.

With the aproach described above all sensitive information would be stored in encrypted format therefore they are secure and generally can't be access from anywhere. So if you left your laptop on the subway or your laptop is stolen by a hacker, he would not be able to get credentials of application that you are working on provided that his IP address is not whitelisted to access RSA key pair

# Implementation

* Create an RSA key pair using following command and store it in some secure place

{%highlight bash%}
$ ssh-keygen -t rsa -q -N ""
{%endhighlight%}

Let create skelton ```KeyManager``` python class that would manage all sensitive information

{%highlight python %}
import argparse
import re
import random
import string
import hashlib
import base64
import logging
from Crypto.PublicKey import RSA
from Crypto import Random
from Crypto.Cipher import AES

def get_content(filename):
    """
    implement this method to get file from secure place
    such as amazon s3 bucket which can be accessed by only
    certain whitelisted IP address
    """
    pass

def get_value(id):
    """
    get encrypted value stored in persistent storage such as
    key-value store
    """
    pass

def put_value(id, value):
    """
    put encrypted value by id to persistent storage such as 
    key-value store
    """
    pass

class KeyManager(object):

    def __init__(self):
        """
        initilization stuff goes here
        """
        pass

    def get(self, id):
        """
        get sensitive data by id
        :type id: str
        :param id: id of stored information
        :rtype: str
        :returns: raw stored value by id
        """
        pass

    def put(self, id, value):
        """
        store sensitive data
        :type id: str
        :param id: id of the value to store
        :type value: str
        :param value: sensitive information to store
        """
        pass

{%endhighlight%}

Now we would implement each method one by one. In constructor we would import RSA key that we have created, additionally we would load encrypted AES key and decrypt it with RSA key.

{%highlight python%}

def __init__(self):
    self.__private_key = RSA.importKey(get_content("public-key-file-name"))
    self.__public_key = RSA.importKey(get_content("private-key-file-name"))
    self.__secret_key = self.__private_key.decrypt(get_value("secret-key"))
    self.__block_size = 32

{%endhighlight%}

We would implement ```get``` method that would load encrypted data by id and return decrypted value and ```put``` method that would save sensitive data in encrypted format. Both methods have used AES encryption, therefore it could be helpful to note how AES can be used to encrypt data in python

{%highlight python%}
"""
Enrypting and decrypting data with Python AES
"""

def _pad(data, block_size):
    """
    pad data
    """
    pad = (block_size - len(data) % block_size)
    return value + pad * chr(pad)

def _unpad(data):
    """
    unpad data
    """
    return data[:-ord(data[-1])]

def get(self, id)
    data = get_value(id)

    # decrypting data using AES
    value = base64.b64decode(data)
    init_vector = value[:AES.block_size]
    cipher = AES.new(self.__secret_key, AES.MODE_CBC, init_vector)
    return _unpad(cipher.decrypt(value[AES.block_size:]).decode("utf-8"))

def put(self, id, data):
    # encrypt data using AES in python
    init_vector = Random.new().read(AES.block_size)
    cipher = AES.new(self.__secret_key, AES.MODE_CBC, init_vector)
    encrypted_data base64.b64encode(init_vector + cipher.encrypt(_pad(value, self.__block_size)))
    # save encrypted data
    put_value(id, encrypted_data)

{%endhighlight%}

I have included complete code here. Note that three method should be implemented carefully to make code functional and ensure security of RSA key. Additionally an AES key should be created and saved to key-value store so that everything work as expected

{%highlight python%}
import argparse
import re
import random
import string
import hashlib
import base64
import logging
from Crypto.PublicKey import RSA
from Crypto import Random
from Crypto.Cipher import AES

def get_content(filename):
    """
    implement this method to get file from secure place
    such as amazon s3 bucket which can be accessed by only
    certain whitelisted IP address
    """
    pass

def get_value(id):
    """
    get encrypted value stored in persistent storage such as
    key-value store
    """
    pass

def put_value(id, value):
    """
    put encrypted value by id to persistent storage such as 
    key-value store
    """
    pass

class KeyManager(object):

    def __init__(self):
        """
        initilization stuff goes here
        """
        self.__private_key = RSA.importKey(get_content("public-key-file-name"))
        self.__public_key = RSA.importKey(get_content("private-key-file-name"))
        self.__secret_key = self.__private_key.decrypt(get_value("secret-key"))
        self.__block_size = 32

    def get(self, id):
        """
        get sensitive data by id
        :type id: str
        :param id: id of stored information
        :rtype: str
        :returns: raw stored value by id
        """
        data = get_value(id)

        # decrypting data using AES
        value = base64.b64decode(data)
        init_vector = value[:AES.block_size]
        cipher = AES.new(self.__secret_key, AES.MODE_CBC, init_vector)
        return self._unpad(
            cipher.decrypt(value[AES.block_size:]).decode("utf-8"))

    def put(self, id, value):
        """
        store sensitive data
        :type id: str
        :param id: id of the value to store
        :type value: str
        :param value: sensitive information to store
        """
        # encrypt data using AES in python
        init_vector = Random.new().read(AES.block_size)
        cipher = AES.new(self.__secret_key, AES.MODE_CBC, init_vector)
        padded_data = self._pad(value, self.__block_size)
        encrypted_data = base64.b64encode(
            init_vector + cipher.encrypt(padded_data))
        # save encrypted data
        put_value(id, encrypted_data)

    @staticmethod
    def _pad(data, block_size):
        """
        pad data
        """
        pad = (block_size - len(data) % block_size)
        return value + pad * chr(pad)

    @staticmethod
    def _unpad(data):
        """
        unpad data
        """
        return data[:-ord(data[-1])]

{%endhighlight%}