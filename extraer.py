import pdfplumber
import pandas as pd
import os

datos = []

for archivo in os.listdir("PDFs"):

    if not archivo.lower().endswith(".pdf"):
        continue

    print("Procesando:", archivo)

    ruta = os.path.join("PDFs", archivo)

    texto = ""

    try:

        with pdfplumber.open(ruta) as pdf:

            for pagina in pdf.pages:

                contenido = pagina.extract_text()

                if contenido:
                    texto += contenido + "\n"

        datos.append({
            "archivo": archivo,
            "texto": texto
        })

        print("OK")

    except Exception as e:

        print("ERROR:", e)

df = pd.DataFrame(datos)

df.to_csv(
    "texto_extraido.csv",
    index=False,
    encoding="utf-8-sig"
)

print("")
print("CSV generado: texto_extraido.csv")