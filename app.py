import os
from flask import Flask, render_template, request, send_file, make_response
from imaginepy import Imagine, Style, Ratio
import base64

app = Flask(__name__)
imagine = Imagine()

for style in Style:
    try:
        file_path = f"static/thumbs/{style.value[1]}.webp"

        # if file exists, skip
        try:
            with open(file_path, "rb") as file:
                file.read()
            print(f"Assets for style {style.value[1]} already exist")
            continue
        except:
            pass

        assets_data = imagine.assets(style)
        with open(file_path, "wb") as file:
            file.write(assets_data)

        print(f"Downloaded assets for style: {style.value[1]}")
    except Exception as e:
        print(
            f"Error occurred while downloading assets for style {style.value[1]}: {e}")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        try:
            message = "Image generated successfully"
            prompt = request.form["prompt"]
            negative = request.form["negative"]
            style = Style[request.form["style"]]
            ratio = Ratio[request.form["ratio"]]
            steps = int(request.form["steps"]) 
            high_res = bool(request.form.get("high_res", False)) 
            upscale = bool(request.form.get("upscale", False))
            cfg = float(request.form["cfg"])

            # high_res needs to be 0 or 1 for the api
            high_res = 1 if high_res else 0

            # Generate random seed number that can go up to 999999999
            seed = int.from_bytes(os.urandom(4), byteorder="big") % 999999999

            img_data = imagine.sdprem(prompt=prompt, style=style, ratio=ratio, high_res_results=high_res, negative=negative, cfg=cfg, seed=seed, priority=1, steps=steps)

            if img_data is None:
                return make_response({"status": "error", "message": "No image data returned from API"}, 500)

            if upscale is not None:
                img_data_upscaled = imagine.upscale(image=img_data)
            
            if img_data_upscaled is not None:
                img_data = img_data_upscaled
            else:
                message = "Upscaling failed, using low res image"

            if img_data is not None:
                return make_response({"status": "success", "img_data": base64.encodebytes(img_data).decode("utf-8"), "message": message})

        except Exception as e:
            return make_response({"status": "error", "message": str(e)}, 500)

    return render_template("index.html", styles=Style, ratios=Ratio)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8083)
