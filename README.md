# Simple Geofence Based Content Output

The following is a simple example of how to use geofence coordinates to output content based on a users location. 

## How to Use:
 - Create a google API key and add it to the `index.html` file.
 - Open the `index.html` file in a browser.
 - Click the button to allow the browser to access your location.
 - If you are within the geofence coordinates you will see a success message.

> You can use the following tool to generate your geofence coordinates: https://www.keene.edu/campus/maps/tool/

### Adding your own Coordinates:
 - Create the coordinate set using the tool above.
 - The last coordinate in the set should be the same as the first coordinate.
 - Open the `src/index.ts` file in a text editor.
 - Find the `geofence` variable and add your own coordinates.
 - Remove any unwanted coordinates.
 - Save the file.
 - build the file using `npm run build`.
 - Open the `index.html` file in a browser.