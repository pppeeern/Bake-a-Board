class RoboflowService {
  constructor() {
    this.apiKey = "uQc88EmmCEKnfImqDqkS";
    this.modelUrl = "https://serverless.roboflow.com/circuit-recognition-bab/8";
    this.componentColors = {
      R: "#feff01",
      G: "#01fece",
      V: "#fe01ff",
      C: "#fe0056",
      I: "#fe8001",
      ARR: "#8622ff",
      ACV: "#c7fc00",
    };
  }

  getComponentColor(className) {
    const lowerClass = className.toLowerCase();

    for (const [key, color] of Object.entries(this.componentColors)) {
      if (
        lowerClass.includes(key.toLowerCase()) ||
        lowerClass === key.toLowerCase()
      ) {
        return color;
      }
    }

    return "#ff6b6b";
  }

  async analyzeImage(imageInput) {
    try {
      const base64Data = imageInput.replace(/^data:image\/[a-z]+;base64,/, "");

      const response = await fetch(
        this.modelUrl + "?" + new URLSearchParams({ api_key: this.apiKey }),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: base64Data,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const processedResult = this.processModelApiResponse(result);

      return { success: true, data: processedResult };
    } catch (error) {
      console.error("Roboflow API error:", error);
      return { success: false, error: error.message };
    }
  }

  processModelApiResponse(apiResponse) {
    const processed = {
      ...apiResponse,
      predictions: apiResponse.predictions || [],
      objectCount: apiResponse.predictions ? apiResponse.predictions.length : 0,
    };

    return processed;
  }

  drawPredictionsOnCanvas(canvas, image, predictions) {
    const ctx = canvas.getContext("2d");

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    predictions.forEach((prediction) => {
      const { x, y, width, height, class: className, confidence } = prediction;

      const left = x - width / 2;
      const top = y - height / 2;

      const componentColor = this.getComponentColor(className);

      ctx.strokeStyle = componentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(left, top, width, height);

      const label = `${className} (${(confidence * 100).toFixed(1)}%)`;
      ctx.font = "bold 16px Arial";
      const textMetrics = ctx.measureText(label);

      ctx.fillStyle = componentColor;
      ctx.fillRect(left, top - 35, textMetrics.width + 20, 35);

      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.strokeText(label, left + 10, top - 10);
      ctx.fillText(label, left + 10, top - 10);

      ctx.fillStyle = componentColor;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(left, top, width, height);
      ctx.globalAlpha = 1.0;
    });

    return canvas.toDataURL("image/jpeg", 0.9);
  }
}

export const roboflowService = new RoboflowService();
