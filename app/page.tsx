"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Home() {
  const [bloques, setBloques] = useState<any[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<any>(null);

  const [preguntas, setPreguntas] = useState<any[]>([]);

  const [pregunta, setPregunta] = useState("");
  const [opcionA, setOpcionA] = useState("");
  const [opcionB, setOpcionB] = useState("");
  const [opcionC, setOpcionC] = useState("");
  const [opcionD, setOpcionD] = useState("");
  const [correcta, setCorrecta] = useState("0");

  const [modoTest, setModoTest] = useState(false);
  const [indicePregunta, setIndicePregunta] = useState(0);

  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState("");

  const [verBaseDatos, setVerBaseDatos] = useState(false);

  const [busqueda, setBusqueda] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {

  obtenerBloques();

  obtenerTodasPreguntas();

}, []);

  async function obtenerBloques() {
    const { data } = await supabase
      .from("BLOQUES")
      .select("*");

    if (data) {
      setBloques(data);
    }
  }

  async function obtenerPreguntas() {
    if (!bloqueSeleccionado) return;

    const { data } = await supabase
      .from("PREGUNTAS")
      .select("*")
      .eq("BLOQUE", bloqueSeleccionado.NOMBRE);

    if (data) {
      setPreguntas(data);
    }
  }
async function obtenerTodasPreguntas() {

  const { data } = await supabase
    .from("PREGUNTAS")
    .select("*");

  if (data) {
    setPreguntas(data);
  }

}
  async function guardarPregunta() {

  console.log("bloqueSeleccionado", bloqueSeleccionado);
console.log("pregunta", pregunta);
const { error } = await supabase
    .from("PREGUNTAS")
    .insert([
      {
        BLOQUE: bloqueSeleccionado.NOMBRE,
        pregunta,
        opcion_a: opcionA,
        opcion_b: opcionB,
        opcion_c: opcionC,
        opcion_d: opcionD,
        correcta: parseInt(correcta),
      },
    ]);

  if (!error) {

    limpiarFormulario();
    setToast("✅ Pregunta guardada");

setTimeout(() => {
  setToast("");
}, 2000);

    obtenerPreguntas();

  }

}

  async function actualizarPregunta() {

  if (editandoId === null) return;

  const { error } = await supabase
    .from("PREGUNTAS")
    .update({
      pregunta,
      opcion_a: opcionA,
      opcion_b: opcionB,
      opcion_c: opcionC,
      opcion_d: opcionD,
      correcta: parseInt(correcta),
    })
    .eq("id", editandoId);

  if (!error) {

    const { data } = await supabase
      .from("PREGUNTAS")
      .select("*")
      .eq("BLOQUE", bloqueSeleccionado.NOMBRE);

    if (data) {
      setPreguntas(data);
    }

    setEditandoId(null);
    setToast("✏️ Pregunta actualizada");

setTimeout(() => {
  setToast("");
}, 2000);

    limpiarFormulario();

  }

}

  async function eliminarPregunta(id: number) {
    await supabase
      .from("PREGUNTAS")
      .delete()
      .eq("id", id);

    obtenerPreguntas();
    setToast("🗑️ Pregunta eliminada");

setTimeout(() => {
  setToast("");
}, 2000);
  }

  function limpiarFormulario() {
    setPregunta("");
    setOpcionA("");
    setOpcionB("");
    setOpcionC("");
    setOpcionD("");
    setCorrecta("0");
  }

  async function empezarTest() {
    await obtenerPreguntas();

    setIndicePregunta(0);
    setModoTest(true);
  }

  function responder(opcion: number) {
    const actual = preguntas[indicePregunta];

    if (!actual) return;

    if (opcion === actual.correcta) {
      setAciertos((prev) => prev + 1);
      setFeedback("✅ Correcta");
    } else {
      setFallos((prev) => prev + 1);
      setFeedback("❌ Incorrecta");
    }

    setTimeout(() => {
      setFeedback("");
    }, 1000);

    const siguiente = indicePregunta + 1;

    if (siguiente < preguntas.length) {
      setIndicePregunta(siguiente);
    } else {
      alert("🎉 Test terminado");
      setModoTest(false);
    }
  }

  if (modoTest) {
    const preguntaActual = preguntas[indicePregunta];
const progreso =
  ((indicePregunta + 1) / preguntas.length) * 100;
    if (!preguntaActual) {
      return (
        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-black">
            No hay preguntas
          </h1>
        </main>
      );
    }

    return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 via-slate-200 to-gray-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setModoTest(false)}
            className="mb-6 rounded-2xl bg-black px-5 py-3 text-white"
          >
            ⬅ Volver
          </button>

          <div className="rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-10 shadow-xl">
            <h1 className="text-4xl font-black mb-10">
              📘 {bloqueSeleccionado.NOMBRE}
            </h1>
            <div className="mb-8">

  <div className="flex justify-between mb-2 text-sm font-bold text-gray-600">

    <span>
      Pregunta {indicePregunta + 1} / {preguntas.length}
    </span>

    <span>
      {Math.round(progreso)}%
    </span>

  </div>

  <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden shadow-inner">

    <div
      className="h-full rounded-full bg-black transition-all duration-500"
      style={{
        width: `${progreso}%`,
      }}
    />

  </div>

</div>

            <div className="flex gap-4 mb-8">
              <div className="rounded-2xl bg-green-100 px-4 py-2 font-bold">
                ✅ {aciertos}
              </div>

              <div className="rounded-2xl bg-red-100 px-4 py-2 font-bold">
                ❌ {fallos}
              </div>
            </div>

            {feedback && (
              <div className="mb-6 rounded-2xl bg-black p-4 text-white font-bold">
                {feedback}
              </div>
            )}

            <div
  key={indicePregunta}
  className="animate-fade"
>

  <h2 className="text-3xl font-black mb-10">
    {preguntaActual.pregunta}
  </h2>

</div>

            <div className="grid gap-4">
              <button
                onClick={() => responder(0)}
                className="rounded-2xl border p-5 text-left hover:bg-gray-100"
              >
                A) {preguntaActual.opcion_a}
              </button>

              <button
                onClick={() => responder(1)}
                className="rounded-2xl border p-5 text-left hover:bg-gray-100"
              >
                B) {preguntaActual.opcion_b}
              </button>

              <button
                onClick={() => responder(2)}
                className="rounded-2xl border p-5 text-left hover:bg-gray-100"
              >
                C) {preguntaActual.opcion_c}
              </button>

              <button
                onClick={() => responder(3)}
                className="rounded-2xl border p-5 text-left hover:bg-gray-100"
              >
                D) {preguntaActual.opcion_d}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (verBaseDatos) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-100 via-slate-200 to-gray-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setVerBaseDatos(false)}
            className="mb-6 rounded-2xl bg-black px-5 py-3 text-white"
          >
            ⬅ Volver
          </button>

          <div className="rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-10 shadow-xl">
            <h1 className="text-5xl font-black mb-10">
              {toast && (

  <div className="mb-6 rounded-2xl bg-black text-white px-6 py-4 font-bold shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-fade">

    {toast}

  </div>

)}
              🗄️ Base de datos
            </h1>

            <select
  value={bloqueSeleccionado?.NOMBRE || ""}
  onChange={async (e) => {

  const bloque = {
    NOMBRE: e.target.value,
  };

  setBloqueSeleccionado(bloque);

  const { data } = await supabase
  .from("PREGUNTAS")
  .select();

  if (data) {
    setPreguntas(data);
  }

}}
              className="w-full rounded-2xl border p-5 mb-6"
            >
              <option value="">Selecciona bloque</option>

              {bloques.map((bloque) => (
                <option
                  key={bloque.NOMBRE}
                  value={bloque.NOMBRE}
                >
                  {bloque.NOMBRE}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="🔎 Buscar pregunta"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-2xl border p-5 mb-8"
            />

            {bloqueSeleccionado && (
              <div className="grid gap-4 mb-10">
                <input
                  type="text"
                  placeholder="Pregunta"
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  className="rounded-2xl border p-5"
                />

                <input
                  type="text"
                  placeholder="Opción A"
                  value={opcionA}
                  onChange={(e) => setOpcionA(e.target.value)}
                  className="rounded-2xl border p-5"
                />

                <input
                  type="text"
                  placeholder="Opción B"
                  value={opcionB}
                  onChange={(e) => setOpcionB(e.target.value)}
                  className="rounded-2xl border p-5"
                />

                <input
                  type="text"
                  placeholder="Opción C"
                  value={opcionC}
                  onChange={(e) => setOpcionC(e.target.value)}
                  className="rounded-2xl border p-5"
                />

                <input
                  type="text"
                  placeholder="Opción D"
                  value={opcionD}
                  onChange={(e) => setOpcionD(e.target.value)}
                  className="rounded-2xl border p-5"
                />

                <select
                  value={correcta}
                  onChange={(e) => setCorrecta(e.target.value)}
                  className="rounded-2xl border p-5"
                >
                  <option value="0">A</option>
                  <option value="1">B</option>
                  <option value="2">C</option>
                  <option value="3">D</option>
                </select>

                <button
  onClick={() => {

  if (editandoId !== null) {

    actualizarPregunta();

  } else {

    guardarPregunta();

  }

}}
                  className="rounded-2xl bg-gradient-to-br from-black to-zinc-800 p-5 text-white font-bold shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:scale-[1.03] hover:-translate-y-2 active:scale-95 active:translate-y-[2px] transition-all duration-150"
                >
                  {editandoId !== null
  ? "💾 Actualizar pregunta"
  : "💾 Guardar pregunta"}
                </button>
              </div>
            )}

            <div className="grid gap-5">
              {preguntas
                .filter((p) => {

  const coincideBusqueda =
    p.pregunta
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

  const coincideBloque =
    !bloqueSeleccionado ||
    p.BLOQUE === bloqueSeleccionado.NOMBRE;

  return coincideBusqueda && coincideBloque;

})
                .map((p, index) => (
                  <div
                    key={p.id}
                    className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50/80 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:scale-[1.01] transition-all duration-300"
                  >
                    <h3 className="text-xl font-bold mb-4">
                      {p.pregunta}
                    </h3>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {

  setEditandoId(p.id);

  setPregunta(p.pregunta);

  setOpcionA(p.opcion_a);

  setOpcionB(p.opcion_b);

  setOpcionC(p.opcion_c);

  setOpcionD(p.opcion_d);

  setCorrecta(String(p.correcta));

}}
                        className="rounded-2xl bg-blue-500 px-5 py-3 text-white font-bold shadow-lg hover:scale-105 active:scale-95 active:translate-y-[2px] transition-all duration-150"
                      >
                        ✏️ Editar
                      </button>

                      <button
                        onClick={() => eliminarPregunta(Number(p.id))}
                        className="rounded-2xl bg-red-500 px-5 py-3 text-white font-bold shadow-lg hover:scale-105 active:scale-95 active:translate-y-[2px] transition-all duration-150"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 via-slate-200 to-gray-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-7xl font-black mb-12">
          📚 Test Oposiciones
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
            onClick={() => setVerBaseDatos(true)}
            className="rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-xl cursor-pointer"
          >
            <h2 className="text-3xl font-black mb-3">
              🗄️ Base de datos
            </h2>

            <p>Gestiona preguntas.</p>
          </div>

          <div
            className="rounded-3xl bg-red-100 p-8 shadow-xl"
          >
            <h2 className="text-3xl font-black mb-3">
              ❌ Fallos
            </h2>

            <p className="mb-6">
              Preguntas incorrectas.
            </p>

            <button
              onClick={async () => {
                const { data } = await supabase
                  .from("FALLOS")
                  .select("*");

                if (data) {
                  setPreguntas(data);
                  setBloqueSeleccionado({
                    NOMBRE: "FALLOS",
                  });
                  setModoTest(true);
                }
              }}
              className="rounded-2xl bg-gradient-to-br from-black to-zinc-800 px-6 py-4 text-white font-bold"
            >
              ▶️ Practicar fallos
            </button>
          </div>

          <div className="rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-xl">
            <h2 className="text-3xl font-black mb-3">
              📊 Estadísticas
            </h2>

            <div className="space-y-3 text-lg">
              <p>✅ Aciertos: {aciertos}</p>
              <p>❌ Fallos: {fallos}</p>

              <p>
                📈 Porcentaje:{" "}
                {aciertos + fallos > 0
                  ? Math.round(
                      (aciertos /
                        (aciertos + fallos)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>

        </div>

        <div className="rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-xl mb-10">
          <h2 className="text-3xl font-black mb-6">
            🎲 Simulacro
          </h2>

          <p className="mb-4">
            Número de preguntas
          </p>

          <input
            type="number"
            value={10}
            readOnly
            className="rounded-2xl border p-5 mb-6 w-40"
          />

          <button
            onClick={async () => {
              const { data } = await supabase
                .from("PREGUNTAS")
                .select("*");

              if (data) {
                const mezcladas = data.sort(
                  () => Math.random() - 0.5
                );

                setPreguntas(
                  mezcladas.slice(0, 10)
                );

                setBloqueSeleccionado({
                  NOMBRE: "SIMULACRO",
                });

                setIndicePregunta(0);

                setModoTest(true);
              }
            }}
            className="rounded-2xl bg-gradient-to-br from-black to-zinc-800 px-8 py-5 text-white font-bold"
          >
            🚀 Empezar simulacro
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bloques.map((bloque) => (
            <div
              key={bloque.NOMBRE}
              className="rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50/70 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/50 hover:scale-[1.03] hover:-translate-y-2 hover:-translate-y-1 transition-all duration-300"
            >
              <h2
                onClick={() => setBloqueSeleccionado(bloque)}
                className="text-2xl font-black mb-6 cursor-pointer"
              >
                📘 {bloque.NOMBRE}
              </h2>

              <button
                onClick={async () => {
                  setBloqueSeleccionado(bloque);

                  const { data } = await supabase
                    .from("PREGUNTAS")
                    .select("*")
                    .eq("BLOQUE", bloque.NOMBRE);

                  if (data) {
                    setPreguntas(data);
                  }

                  setModoTest(true);
                }}
                className="rounded-2xl bg-gradient-to-br from-black to-zinc-800 px-6 py-4 text-white font-bold"
              >
                ▶️ Empezar test
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

