# Simple Geofence Based Content Output

The followign library is a simple Typescript module that accepts a list of geofence coordinates and will request the users location and then if the user is within the geofence will output the content. 

You can configure both the geofence coordinates and the limit of the geofence in meters. The conditional output is currently just set as an alert that tells the user whether or not they are within the geofence but it can easily be adapted to be a form condition or prevent an API request for output.


## Requirements
 - You will need to setup a google API and add your key 

> Use: https://www.keene.edu/campus/maps/tool/ to generate your geofence coordinates