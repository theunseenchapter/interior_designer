import React, { useState, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, ArrowRepeat } from 'lucide-react';

const App = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomType, setRoomType] = useState("living-room");
  const [styleType, setStyleType] = useState("tropical");
  const [recentDesigns, setRecentDesigns] = useState([]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        handleFile(file);
      }
    }
  }, []);

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      handleFile(file);
    };
    input.click();
  };

  const handleRender = async () => {
    if (previewImage) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResultImage(previewImage);
      setIsLoading(false);
      
      setRecentDesigns(prev => [{
        image: previewImage,
        room: roomType,
        style: styleType
      }, ...prev]);
    }
  };

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4 max-w-6xl">
        <Card className="mb-6 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">AI ROOM PLANNER</CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Current Interior</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`drop-zone h-64 rounded-lg flex items-center justify-center cursor-pointer mb-4 ${!previewImage ? 'border-2 border-dashed border-gray-300' : ''}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={handleUploadClick}
              >
                {!previewImage ? (
                  <div className="text-center">
                    <UploadCloud className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">Drop an image, tap to upload, or CTRL + V</p>
                  </div>
                ) : (
                  <img src={previewImage} alt="Preview" className="max-h-full max-w-full object-contain" />
                )}
              </div>

              <div className="space-y-4">
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-room">Living room</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={styleType} onValueChange={setStyleType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tropical">Tropical</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="minimalist">Minimalist</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="scandinavian">Scandinavian</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full" onClick={handleRender}>
                  Render new idea
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center">
                    <ArrowRepeat className="w-8 h-8 mx-auto text-blue-500 animate-spin" />
                    <p className="mt-2 text-gray-600">Generating design...</p>
                  </div>
                ) : resultImage ? (
                  <img src={resultImage} alt="Result" className="max-h-full max-w-full object-contain" />
                ) : (
                  <p className="text-gray-500">Your transformed room will appear here</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Rendered Designs</CardTitle>
            <p className="text-gray-600">
              AI is a great tool to generate interior design ideas. It can give you an idea of how a space could look and feel like. Let's see the recent works from AI:
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentDesigns.map((design, index) => (
                <div key={index} className="relative group">
                  <img src={design.image} alt="Design" className="w-full h-48 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="font-medium">{design.room}</p>
                      <p className="text-sm">{design.style} style</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;