import fitz
import pytesseract
import pandas as pd
import os
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Users\crist\AppData\Local\Programs\Tesseract-OCR\tesseract.exe"
)

datos = []

for archivo in os.listdir("PDFs"):

    if not archivo.lower().endswith(".pdf"):
        continue

    print(f"Procesando: {archivo}")

    ruta = os.path.join("PDFs", archivo)

    texto_completo = ""

    try:

        pdf = fitz.open(ruta)

        for pagina_num in range(len(pdf)):

            pagina = pdf.load_page(pagina_num)

            pix = pagina.get_pixmap(matrix=fitz.Matrix(2, 2))

            nombre_temp = "temp.png"

            pix.save(nombre_temp)

            texto = pytesseract.image_to_string(
                Image.open(nombre_temp),
                lang="spa"
            )

            texto_completo += texto + "\n"

        datos.append({
            "archivo": archivo,
            "texto": texto_completo
        })

        print("OK")

    except Exception as e:

        print("ERROR:", e)

df = pd.DataFrame(datos)

df.to_csv(
    "texto_ocr.csv",
    index=False,
    encoding="utf-8-sig"
)

print("")
print("================================")
print("CSV GENERADO: texto_ocr.csv")
print("================================")