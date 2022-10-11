# Make Your Own Artificial Intelligence Driven Web App to Decorate Faces

The app will capture video and then apply artificial intelligence to decorate your face.

Make your own with [REPLIT.com](https://replit.com/@apatterson189/face-decoration)

![Demo](./doc/demo.gif 'Demo')

## Create your own

1. Create a png image to use as the decoration. Any app that allows you to create png files will work fine. The default decoration uses Google Drawings to make simple [sunglasses](https://docs.google.com/drawings/d/1k2MwpDjihT9NPSYpl2-Tn-whb9s2UMe-R5D7QDCNZAs/edit?usp=sharing). A few options:
   1. [Google Drawings](https://docs.google.com/drawings)
   1. [Figma](https://www.figma.com/)
   1. etc...
1. replace the image at "edit/decoration.png" with your new decoration.
1. update "edit/get_bbox.js" to correctly calculate the bounding box for your decoration. - the face parameter includes data like the following:
   ```json {
     keypoints: [
       { x: 141.12911522388458, y: 61.342158913612366, name: 'rightEye' },
       { x: 180.09960651397705, y: 64.57690268754959, name: 'leftEye' },
       { x: 167.23176956176758, y: 80.21624475717543, name: 'noseTip' },
       { x: 162.79112339019775, y: 103.3753228187561, name: 'mouthCenter' },
       { x: 105.58950573205948, y: 76.71291291713715, name: 'rightEarTragion' },
       { x: 189.94628965854645, y: 81.71663135290144, name: 'leftEarTragion' },
     ],
     box: {
       xMin: 104.71575379371643,
       xMax: 198.0016404390335,
       yMin: 42.12142705917359,
       yMax: 135.40725827217102,
       width: 93.28588664531708,
       height: 93.28583121299742,
     },
   }
   ```
1. The bounding box should return the following data:

   - x: the x coordinate of the top left corner of the decoration
   - y: the y coordinate of the top left corner of the decoration
   - width: the width of the decoration
   - height: the height of the decoration

1. You can use the provided example to check if your calculation is correct
