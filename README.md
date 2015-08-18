#react-crop#
An accessible image cropper where the image is stationary and a resizable, draggable box represents the cropped image

For example usage check out the example folder. For a demo checkout: https://cdn.rawgit.com/shichongrui/react-crop/master/example/

###Props###

####`width`####
This is the desired width that you would like the image to be cropped to. The width of the cropper will be scaled to fit this size. This prop also helps determine the minimum width that the cropper can be.

####`height`####
This is the desired height that you would like the image to be cropped to. The height of the cropper will be scaled tof it this size. This prop also helps determine the minimum height that the cropper can be. The width and height aspect ratio will be preserved while resizing the cropper.

####`image`####
A `blob` of the original image that you wish to crop.

####`widthLabel`####
The label to use next to the width input used for keyboard users. This is especially useful if you need to localize the text. The default is "Width".

####`heightLabel`####
The label to use next to the height input used for keyboard users. This is especially useful if you need to localize the text. The default is "Height".

####`offsetXLabel`####
The label to use next to the offset X input used for keyboard users. This is especially useful if you need to localize the text. The default is "Offset X".

####`offsetYLabel`####
The label to use next to the offset Y input used for keyboard users. This is especially useful if you need to localize the text. The default is "Offset Y".

###Running the Example###
 - Clone the repo
 - `npm i`
 - `npm run example`
 - Visit `localhost:8080`
