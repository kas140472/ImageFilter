var img = null;
var ogImg = null;
var imgFile;
var cv1 = document.getElementById("cv1");
var cv2 = document.getElementById("cv2"); 

var frameSize = 10;
var frameRVal = 0;
var frameGVal = 0;
var frameBVal = 0;
    
function loadImage()
{
    var heightRatio = 0.5;
    cv1.height = cv1.width * heightRatio; 
    imgFile = document.getElementById("img");
    img = new SimpleImage(imgFile);
    ogImg = new SimpleImage(imgFile);
    clearCanvas();
    ogImg.drawTo(cv1);
    
    var s = document.getElementById("s");
    s.innerHTML = '';
}

function isImageLoaded(imgCheck)
{
    if(imgCheck==null || !imgCheck.complete())
    {
        alert("Image not loaded.");
        return false;
    }
    return true;
}

function doGray() 
{
    if(isImageLoaded(img)) 
    {     
      filterGray();	                  
      img.drawTo(cv2);
      ogImg.drawTo(cv1);
    }
}

function filterGray()
{
    for(var pixel of img.values())
    {
        var avg = (pixel.getGreen()+pixel.getRed()+pixel.getBlue())/3;
        pixel.setRed(avg);
        pixel.setGreen(avg);
        pixel.setBlue(avg);
    } 
}

function doRed() 
{
    if(isImageLoaded(img)) 
    {     
        for(var pixel of img.values())
        {
            var avg = (pixel.getGreen()+pixel.getRed()+pixel.getBlue())/3;
            setHue(pixel,avg,2*avg,0,0,255,2*avg-255,2*avg-255);
        }                   
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function doRainbow() 
{
    if(isImageLoaded(img)) 
    {     
        for(var pixel of img.values())
        {
            var avg = (pixel.getGreen()+pixel.getRed()+pixel.getBlue())/3;
            if(pixel.getY()<img.getHeight()/7)
            {
                filteredPixelByColor(pixel,avg,255,0,0);
            }
            else if(pixel.getY()<(2*img.getHeight())/7)
            {
                filteredPixelByColor(pixel,avg,255,165,0);
            }
            else if(pixel.getY()<(3*img.getHeight())/7)
            {
                filteredPixelByColor(pixel,avg,255,255,0);
            }
            else if(pixel.getY()<(4*img.getHeight())/7)
            {
                filteredPixelByColor(pixel,avg,0,128,0);
            }
            else if(pixel.getY()<(5*img.getHeight())/7)
            {
                filteredPixelByColor(pixel,avg,0,0,255);
            }
            else if(pixel.getY()<(6*img.getHeight())/7)
            {
                filteredPixelByColor(pixel,avg,75,0,130);
            }
            else if(pixel.getY()<=(img.getHeight()))
            {
                filteredPixelByColor(pixel,avg,148,0,211);
            }
        }                   
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function doBlur()
{
    if(isImageLoaded(img))
    {
        var blurImg = new SimpleImage(img.getWidth(),img.getHeight());
        for(var pixel of img.values())
        {
            if(Math.random() < 0.5)
            {
                blurImg.setPixel(pixel.getX(),pixel.getY(),pixel); 
            }
            else
            {
                var xOffset = Math.floor(Math.random()*10);
                var yOffset = Math.floor(Math.random()*10);

                var x = pixel.getX() + xOffset;
                var y = pixel.getY() + yOffset;
                
                if((x>=0) && (x<img.getWidth()) && (y>=0) && (y<img.getHeight()))
                {
                    blurImg.setPixel(pixel.getX(),pixel.getY(),img.getPixel(x,y)); 
                }
                else
                {
                    blurImg.setPixel(pixel.getX(),pixel.getY(),pixel); 
                }
            }
        }
        img = blurImg;                 
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function imgSize()
{
    var s = document.getElementById("s");
    if(isImageLoaded(img))
    {
        s.innerHTML = img.getWidth()+' x '+img.getHeight();
    }
    else
    {
        s.innerHTML = "Image not loaded";
    }
}

function isNumeric (value) 
{
    // standard JavaScript function to determine whether a string is an illegal number (Not-a-Number)
    return !isNaN(value);
}

function colorHexStrToInt(colorStr) 
{
    //Remove # character
    var re = /^#?/;
    colorStr = colorStr.replace(re, '');
    //Convert
    var colorInt = parseInt(colorStr, 16);
    return colorInt;  
}

function applyColor(value)
{
    var colorInt = colorHexStrToInt(value); 
    var rVal = (colorInt >>> 16) & 0xFF;
    var gVal = (colorInt >>> 8) & 0xFF;
    var bVal = colorInt & 0xFF; 
    if(isImageLoaded(img)) 
    {     
        for(var pixel of img.values())
        {
            var avg = (pixel.getGreen()+pixel.getRed()+pixel.getBlue())/3;
            filteredPixelByColor(pixel,avg,rVal,gVal,bVal);
        }                  
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function filteredPixelByColor(pixel,avg,rVal,gVal,bVal)
{
    var lR = filteredPixelLesser128(avg,rVal);
    var gR = filteredPixelGreater128(avg,rVal);
    var lG = filteredPixelLesser128(avg,gVal);
    var gG = filteredPixelGreater128(avg,gVal);
    var lB = filteredPixelLesser128(avg,bVal);
    var gB = filteredPixelGreater128(avg,bVal);
    setHue(pixel,avg,lR,lG,lB,gR,gG,gB);
}

function filteredPixelLesser128(avg,val)
{
    return val/127.5*avg;
}

function filteredPixelGreater128(avg,val)
{
    return (2 - val/127.5)*avg + 2*val - 255;
}

function setHue(pixel,avg,lR,lG,lB,gR,gG,gB)
{
    if(avg<128)
    {
        pixel.setRed(lR);
        pixel.setGreen(lG);
        pixel.setBlue(lB);
    }
    else
    {
        pixel.setRed(gR);
        pixel.setGreen(gG);
        pixel.setBlue(gB);
    } 
}

function doMirror()
{
    if(isImageLoaded(img)) 
    {     
        for(var pixel of img.values())
        {
            if(pixel.getX()<img.getWidth()/2)
            {
                var x = pixel.getX();
                var y = pixel.getY();
                var mirrorX = img.getWidth()-x-1;

                var pixel2 = img.getPixel(mirrorX,y);
                var rTemp = pixel2.getRed();
                var gTemp = pixel2.getGreen();
                var bTemp = pixel2.getBlue();
                pixel2.setRed(pixel.getRed());
                pixel2.setGreen(pixel.getGreen());
                pixel2.setBlue(pixel.getBlue());
                pixel.setRed(rTemp);
                pixel.setGreen(gTemp);
                pixel.setBlue(bTemp);
            }
        }
    }                  
    img.drawTo(cv2);
    ogImg.drawTo(cv1);
}

function doUpsideDown()
{
    if(isImageLoaded(img)) 
    {     
        for(var pixel of img.values())
        {
            if(pixel.getY()<img.getHeight()/2)
            {
                var x = pixel.getX();
                var y = pixel.getY();
                var mirrorY = img.getHeight()-y-1;

                var pixel2 = img.getPixel(x,mirrorY);
                var rTemp = pixel2.getRed();
                var gTemp = pixel2.getGreen();
                var bTemp = pixel2.getBlue();
                pixel2.setRed(pixel.getRed());
                pixel2.setGreen(pixel.getGreen());
                pixel2.setBlue(pixel.getBlue());
                pixel.setRed(rTemp);
                pixel.setGreen(gTemp);
                pixel.setBlue(bTemp);
            }
        }
    }                   
    img.drawTo(cv2);
    ogImg.drawTo(cv1);
}

function resizeFrame(value)
{
    var sizeOutput = document.getElementById("sizeOutput");
    sizeOutput.innerHTML = value;

    if(value >= 0 && value < img.getWidth() && value < img.getHeight())
    {
        frameSize = value;
    }
    else
    {
        alert('Border size exceeds image size.')
    }
    
}

function frameColor(value)
{
    var colorInt = colorHexStrToInt(value); 
    frameRVal = (colorInt >>> 16) & 0xFF;
    frameGVal = (colorInt >>> 8) & 0xFF;
    frameBVal = colorInt & 0xFF; 
}

function doFrame()
{
    if(isImageLoaded(img)) 
    {    
        var frameImg = new SimpleImage(img); 
        for(var pixel of frameImg.values())
        {
            if((pixel.getX()<frameSize) || (pixel.getX()>img.getWidth()-frameSize))
            {
                pixel.setRed(frameRVal);
                pixel.setGreen(frameGVal);
                pixel.setBlue(frameBVal);
            }
            if((pixel.getY()<frameSize) || (pixel.getY()>img.getHeight()-frameSize))
            {
                pixel.setRed(frameRVal);
                pixel.setGreen(frameGVal);
                pixel.setBlue(frameBVal);
            }
        }                   
        frameImg.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function doCornerFrame()
{
    if(isImageLoaded(img)) 
    {    
        for(var pixel of img.values())
        {
            if(pixel.getX()<img.getWidth()/10 || pixel.getX()>(9*img.getWidth())/10)
            {
                if((pixel.getY()<(img.getHeight()/50)) || (pixel.getY()>((49*img.getHeight())/50)))
                {
                    pixel.setRed(0);
                    pixel.setGreen(0);
                    pixel.setBlue(0);
                }
            }
            if(pixel.getX()<img.getWidth()/50 || pixel.getX()>(49*img.getWidth())/50)
            {
                if((pixel.getY()<(img.getHeight()/10)) || (pixel.getY()>((9*img.getHeight())/10)))
                {
                    pixel.setRed(0);
                    pixel.setGreen(0);
                    pixel.setBlue(0);
                }
            }
        }                 
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function doInvert()
{
    if(isImageLoaded(img)) 
    {    
        for(var pixel of img.values())
        {
            pixel.setRed(255 - pixel.getRed());
            pixel.setGreen(255 - pixel.getGreen());
            pixel.setBlue(255 - pixel.getBlue());
        }
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function doChessBoard() 
{
    if(isImageLoaded(img)) 
    {     
        for(var pixel of img.values())
        {
            var avg = (pixel.getGreen()+pixel.getRed()+pixel.getBlue())/3;
            var x = pixel.getX();
            var y = pixel.getY();
            var w = img.getWidth();
            var h = img.getHeight();

            if(y<h/8 || (y>=(2*h)/8 && y<(3*h)/8) || (y>=(4*h)/8 && y<(5*h)/8) || (y>=(6*h)/8 && y<(7*h)/8))
            {
                if(x<w/8 || (x>=(2*w)/8 && x<(3*w)/8) || (x>=(4*w)/8 && x<(5*w)/8) || (x>=(6*w)/8 && x<(7*w)/8))
                {
                    filteredPixelByColor(pixel,avg,255,255,255);
                }
                else
                {
                    filteredPixelByColor(pixel,avg,0,0,0);
                }
            }
            else
            {
                if(x<w/8 || (x>=(2*w)/8 && x<(3*w)/8) || (x>=(4*w)/8 && x<(5*w)/8) || (x>=(6*w)/8 && x<(7*w)/8))
                {
                    filteredPixelByColor(pixel,avg,0,0,0);
                }
                else
                {
                    filteredPixelByColor(pixel,avg,255,255,255);
                }
            }
        }                   
        img.drawTo(cv2);
        ogImg.drawTo(cv1);
    }
}

function doReset()
{
    if(isImageLoaded(img))
    {
        img = new SimpleImage(imgFile);
        ogImg.drawTo(cv1);
        img.drawTo(cv2);
        grayImg = new SimpleImage(imgFile);
        redImg = new SimpleImage(imgFile);
        rainbowImg = new SimpleImage(imgFile);
    }
}

function clearCanvas()
{
    var ctx1 = cv1.getContext("2d");
    ctx1.clearRect(0, 0, cv1.width, cv1.height);

    var ctx2 = cv2.getContext("2d");
    ctx2.clearRect(0, 0, cv2.width, cv2.height);
}