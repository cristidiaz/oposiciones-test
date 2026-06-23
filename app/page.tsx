"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Confetti from "react-confetti";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [bloques, setBloques] = useState<any[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<any>(null);

  const [preguntas, setPreguntas] = useState<any[]>([]);
const [supuestos, setSupuestos] = useState<any[]>([]);
const [supuestoSeleccionado, setSupuestoSeleccionado] = useState<any>(null);
  const [pregunta, setPregunta] = useState("");
  const [opcionA, setOpcionA] = useState("");
  const [opcionB, setOpcionB] = useState("");
  const [opcionC, setOpcionC] = useState("");
  const [opcionD, setOpcionD] = useState("");
  const [correcta, setCorrecta] = useState("0");
  const [verEstadisticas, setVerEstadisticas] =
  useState(false);
  const [verSimulacro, setVerSimulacro] =
  useState(false);
  const [oficial, setOficial] = useState(false);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] =
  useState<number[]>([]);
  const [respuestasSupuesto, setRespuestasSupuesto] =
  useState<{ [key: number]: number }>({});

  const [modoTest, setModoTest] = useState(false);
  const [indicePregunta, setIndicePregunta] = useState(0);

  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);

  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState("");
  const [numeroPreguntas, setNumeroPreguntas] =
  useState(20);
  const [bloquesSimulacro, setBloquesSimulacro] =
  useState<string[]>([]);

  const [verBaseDatos, setVerBaseDatos] = useState(false);

  const [busqueda, setBusqueda] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarConfetti, setMostrarConfetti] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [seccionActiva, setSeccionActiva] =
  useState("inicio");
  const [estadisticasSupuestos, setEstadisticasSupuestos] =
  useState({
    realizados: 0,
    aptos: 0,
    noAptos: 0,
    mejorNota: 0,
    media: 0,
  });
  const [ejercicioSeleccionado, setEjercicioSeleccionado] =
  useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mostrarResultado, setMostrarResultado] =
  useState(false);
  const [preguntasSupuesto, setPreguntasSupuesto] =
  useState<any[]>([]);

const [resultadoSupuesto, setResultadoSupuesto] =
  useState<any>(null);
  const [modoRevisionSupuesto, setModoRevisionSupuesto] =
  useState(false);

const [mostrarResultadoSupuesto, setMostrarResultadoSupuesto] =
  useState(false);

const datosGrafico = [
  { value: 20 },
  { value: 45 },
  { value: 35 },
  { value: 60 },
  { value: 55 },
  { value: 80 },
  { value: 72 },
  { value: 95 },
];

  useEffect(() => {

  obtenerBloques();

  obtenerTodasPreguntas();

}, []);
useEffect(() => {

  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

}, [darkMode]);

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
.range(0, 5000)
      .eq("BLOQUE", bloqueSeleccionado.NOMBRE);

    if (data) {
      setPreguntas(data);
    }
  }
async function obtenerTodasPreguntas() {

  const { data } = await supabase
    .from("PREGUNTAS")
.select("*")
.range(0, 5000)

  if (data) {
  setPreguntas(data);
}

}
async function obtenerSupuestos() {
  const { data } = await supabase
    .from("SUPUESTOS")
    .select("*");

  if (data) {
    setSupuestos(data);
  }
}

  async function obtenerPreguntasSupuesto(
  supuestoId: number
) {

  const { data } = await supabase
    .from("PREGUNTAS_SUPUESTO")
    .select("*")
    .eq("supuesto_id", supuestoId);

  if (data) {
    setPreguntasSupuesto(data);
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
OFICIAL: oficial,
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
      BLOQUE: bloqueSeleccionado.NOMBRE,
      pregunta,
      opcion_a: opcionA,
      opcion_b: opcionB,
      opcion_c: opcionC,
      opcion_d: opcionD,
      correcta: parseInt(correcta),
OFICIAL: oficial,
    })
    .eq("id", editandoId);

  if (!error) {

    const { data } = await supabase
      .from("PREGUNTAS")
.select("*")
.range(0, 5000)
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
    setOficial(false);
  }

  async function empezarTest() {
    await obtenerPreguntas();

    setIndicePregunta(0);
    setModoTest(true);
  }

 async function responder(opcion: number) {
    const actual = preguntas[indicePregunta];

    if (!actual) return;
    setRespuestaSeleccionada(opcion);
if (opcion === actual.correcta) {

  setAciertos((prev) => prev + 1);

  setFeedback("✅ Correcta");

  if (
    bloqueSeleccionado?.NOMBRE === "FALLOS"
  ) {

    await supabase
      .from("FALLOS")
      .delete()
      .eq("id", actual.id);

  }

}
     else {

  setFallos((prev) => prev + 1);

  setFeedback("❌ Incorrecta");

  if (
    bloqueSeleccionado?.NOMBRE !== "FALLOS"
  ) {

    await supabase
      .from("FALLOS")
      .insert([
        {
          BLOQUE: actual.BLOQUE,
          pregunta: actual.pregunta,
          opcion_a: actual.opcion_a,
          opcion_b: actual.opcion_b,
          opcion_c: actual.opcion_c,
          opcion_d: actual.opcion_d,
          correcta: actual.correcta,
        },
      ]);

  }

}

    setTimeout(() => {
      setFeedback("");
    }, 1000);

  setTimeout(() => {

  const siguiente = indicePregunta + 1;

  if (siguiente < preguntas.length) {

    setIndicePregunta(siguiente);

    setRespuestaSeleccionada(null);

  } else {

  setMostrarConfetti(true);

  setTimeout(() => {
    setMostrarConfetti(false);
  }, 5000);

  setRespuestaSeleccionada(null);

  setMostrarResultado(true);

}

}, 1200);

}
  if (modoTest) {

  const preguntaActual = preguntas[indicePregunta];

  const progreso =
    ((indicePregunta + 1) / preguntas.length) * 100;

  if (!preguntaActual && !mostrarResultado) {
    return (
      <main className="min-h-screen animate-fade flex items-center justify-center">
        <h1 className="text-4xl font-black">
          No hay preguntas
        </h1>
        
      </main>
    );
  }

  return (
    <>
  {mostrarConfetti && <Confetti />}
  {mostrarResultado && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

    <div className="w-full max-w-md rounded-[32px] bg-white dark:bg-zinc-900 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.25)] animate-fade">

      <h2 className="text-4xl font-black mb-6 text-center">
        🎉 Test finalizado
      </h2>

      <div className="space-y-4 text-xl font-bold">

        <div className="flex justify-between">
          <span>✅ Aciertos</span>
          <span>{aciertos}</span>
        </div>

        <div className="flex justify-between">
          <span>❌ Fallos</span>
          <span>{fallos}</span>
        </div>

        <div className="flex justify-between">
          <span>📈 Resultado</span>
          <span>
            {aciertos + fallos > 0
              ? Math.round(
                  (aciertos /
                    (aciertos + fallos)) *
                    100
                )
              : 0}
            %
          </span>
        </div>

      </div>

      <button
        onClick={() => {

          setMostrarResultado(false);

          setModoTest(false);

        }}
        className="mt-10 w-full rounded-2xl bg-black py-4 text-white font-bold hover:scale-[1.02] transition-all"
      >
        🚀 Continuar
      </button>

    </div>

  </div>

)}

      <main className="min-h-screen animate-fade bg-gradient-to-br from-zinc-100 via-slate-200 to-gray-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-10">
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
    {preguntaActual.OFICIAL && (

  <div className="inline-flex items-center gap-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 mt-4">

    <span>🏛️</span>

    <span className="font-bold text-yellow-600">
      Pregunta oficial
    </span>

  </div>

)}
  </h2>

</div>

            <div className="grid gap-4">

  {[
    preguntaActual.opcion_a,
    preguntaActual.opcion_b,
    preguntaActual.opcion_c,
    preguntaActual.opcion_d,
  ].map((opcion, index) => (

    <button
      key={index}
      onClick={() => responder(index)}
      className={`
        rounded-2xl p-5 text-left font-bold transition-all duration-300 shadow-lg hover:scale-[1.02]

        ${
          respuestaSeleccionada === index &&
          preguntaActual.correcta === index
            ? "bg-green-500 text-white shadow-green-500/50"
            : ""
        }

        ${
          respuestaSeleccionada === index &&
          preguntaActual.correcta !== index
            ? "bg-red-500 text-white shadow-red-500/50"
            : ""
        }

        ${
  respuestaSeleccionada !== null &&
  respuestaSeleccionada !== index &&
  preguntaActual.correcta === index
    ? "bg-green-500/80 text-white"
    : ""
}

        ${
          respuestaSeleccionada === null
            ? "bg-white/70 dark:bg-zinc-900/70 border border-white/50"
            : ""
        }
      `}
    >
      {["A", "B", "C", "D"][index]}) {opcion}
    </button>

  ))}

</div>
          </div>
        </div>
      </main>

    </>

  );

}

  
   if (verBaseDatos) { return (
      <main className="min-h-screen animate-fade bg-gradient-to-br from-zinc-100 via-slate-200 to-gray-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setVerBaseDatos(false)}
            className="mb-6 rounded-2xl bg-black px-5 py-3 text-white"
          >
            ⬅ Volver
          </button>

          <div className="rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-10 shadow-xl">
            {toast && (

  <div className="mb-6 rounded-2xl bg-black text-white px-6 py-4 font-bold shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-fade">

    {toast}

  </div>

)}

<h1 className="text-5xl font-black mb-10">
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
.select("*")
.range(0, 5000)

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
            <div className="flex items-center gap-3">

  <input
    type="checkbox"
    checked={oficial}
    onChange={(e) =>
      setOficial(e.target.checked)
    }
    className="w-5 h-5"
  />

  <p className="font-bold">
    🏛️ Pregunta oficial
  </p>

</div>

            <input
              type="text"
              placeholder="🔎 Buscar pregunta"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-2xl border p-5 mb-8"
            />

            {bloqueSeleccionado && (
              <div className="grid gap-4 mb-10">
                <select
  value={bloqueSeleccionado?.NOMBRE || ""}
  onChange={(e) =>
    setBloqueSeleccionado({
      NOMBRE: e.target.value,
    })
  }
  className="rounded-2xl border p-5"
>
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
<div className="flex gap-4 mb-6">

  <select
    id="bloqueDestino"
    className="rounded-2xl border p-4"
  >
    {bloques.map((bloque) => (

      <option
        key={bloque.NOMBRE}
        value={bloque.NOMBRE}
      >
        {bloque.NOMBRE}
      </option>

    ))}
  </select>

  <button
    onClick={async () => {

      const select =
        document.getElementById(
          "bloqueDestino"
        ) as HTMLSelectElement;

      const destino = select.value;

      await supabase
        .from("PREGUNTAS")
        .update({
          BLOQUE: destino,
        })
        .in("id", preguntasSeleccionadas);

      obtenerPreguntas();

      setPreguntasSeleccionadas([]);

      setToast(
        "🚚 Preguntas movidas"
      );

    }}
    className="rounded-2xl bg-black px-6 py-4 text-white font-bold"
  >
    🚚 Mover seleccionadas
  </button>

</div>
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
                    <div className="flex items-start gap-4 mb-4">

  <input
    type="checkbox"
    checked={preguntasSeleccionadas.includes(p.id)}
    onChange={(e) => {

      if (e.target.checked) {

        setPreguntasSeleccionadas([
          ...preguntasSeleccionadas,
          p.id,
        ]);

      } else {

        setPreguntasSeleccionadas(
          preguntasSeleccionadas.filter(
            (id) => id !== p.id
          )
        );

      }

    }}
    className="mt-1 w-5 h-5"
  />

  <h3 className="text-xl font-bold">
    {p.pregunta}
  </h3>

</div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {

  setEditandoId(p.id);
  setBloqueSeleccionado({
  NOMBRE: p.BLOQUE,
});

  setPregunta(p.pregunta);

  setOpcionA(p.opcion_a);

  setOpcionB(p.opcion_b);

  setOpcionC(p.opcion_c);

  setOpcionD(p.opcion_d);

  setCorrecta(String(p.correcta));
  setOficial(p.OFICIAL || false);

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
  if (supuestoSeleccionado) {

  return (

    <main className="min-h-screen p-10">

      <button
        onClick={() =>
          setSupuestoSeleccionado(null)
        }
        className="mb-8 rounded-2xl bg-black px-5 py-3 text-white"
      >
        ⬅ Volver
      </button>

      <h1 className="text-5xl font-black mb-8">
        {supuestoSeleccionado.titulo}
      </h1>

      <div className="rounded-3xl bg-white p-8 shadow-xl mb-10">

        <h2 className="text-2xl font-bold mb-4">
          Enunciado
        </h2>

        <p>
          {supuestoSeleccionado.enunciado}
        </p>

      </div>

      <div className="grid gap-6">

        {preguntasSupuesto.map((p, index) => (

          <div
            key={p.id}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >

            <h3 className="text-xl font-black mb-4">
              Pregunta {index + 1}
            </h3>

            <p>
              {p.pregunta}
            </p>
            {modoRevisionSupuesto && (

  <div className="mt-4 rounded-2xl bg-zinc-100 p-4 space-y-3">

    <p
  className={`font-bold ${
    respuestasSupuesto[p.id] === p.correcta
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {respuestasSupuesto[p.id] === p.correcta ? "✅" : "❌"} Tu respuesta:

  {" "}

  {respuestasSupuesto[p.id] === 1
    ? `A) ${p.opcion_a}`
    : respuestasSupuesto[p.id] === 2
    ? `B) ${p.opcion_b}`
    : respuestasSupuesto[p.id] === 3
    ? `C) ${p.opcion_c}`
    : respuestasSupuesto[p.id] === 4
    ? `D) ${p.opcion_d}`
    : "Sin responder"}
</p>

    <p className="font-bold text-green-600">

      ✅ Correcta:

      {" "}

      {p.correcta === 1
        ? `A) ${p.opcion_a}`
        : p.correcta === 2
        ? `B) ${p.opcion_b}`
        : p.correcta === 3
        ? `C) ${p.opcion_c}`
        : `D) ${p.opcion_d}`}

    </p>

  </div>

)}
            
<div className="grid gap-3 mt-6">

  <button
    onClick={() =>
      setRespuestasSupuesto({
        ...respuestasSupuesto,
        [p.id]: 1,
      })
    }
    className={`rounded-2xl border p-4 text-left transition-all

${
  modoRevisionSupuesto
    ? p.correcta === 1
      ? "bg-green-500 text-white border-green-500"
      : respuestasSupuesto[p.id] === 1
      ? "bg-red-500 text-white border-red-500"
      : ""
    : respuestasSupuesto[p.id] === 1
    ? "bg-blue-500 text-white border-blue-500"
    : ""
}

`}
  >
    A) {p.opcion_a}
  </button>

  <button
    onClick={() =>
      setRespuestasSupuesto({
        ...respuestasSupuesto,
        [p.id]: 2,
      })
    }
    className={`rounded-2xl border p-4 text-left transition-all

${
  modoRevisionSupuesto
    ? p.correcta === 2
      ? "bg-green-500 text-white border-green-500"
      : respuestasSupuesto[p.id] === 2
      ? "bg-red-500 text-white border-red-500"
      : ""
    : respuestasSupuesto[p.id] === 2
    ? "bg-blue-500 text-white border-blue-500"
    : ""
}

`}
  >
    B) {p.opcion_b}
  </button>

  <button
    onClick={() =>
      setRespuestasSupuesto({
        ...respuestasSupuesto,
        [p.id]: 3,
      })
    }
    className={`rounded-2xl border p-4 text-left transition-all

${
  modoRevisionSupuesto
    ? p.correcta === 3
      ? "bg-green-500 text-white border-green-500"
      : respuestasSupuesto[p.id] === 3
      ? "bg-red-500 text-white border-red-500"
      : ""
    : respuestasSupuesto[p.id] === 3
    ? "bg-blue-500 text-white border-blue-500"
    : ""
}

`}
  >
    C) {p.opcion_c}
  </button>

  <button
    onClick={() =>
      setRespuestasSupuesto({
        ...respuestasSupuesto,
        [p.id]: 4,
      })
    }
    className={`rounded-2xl border p-4 text-left transition-all

${
  modoRevisionSupuesto
    ? p.correcta === 4
      ? "bg-green-500 text-white border-green-500"
      : respuestasSupuesto[p.id] === 4
      ? "bg-red-500 text-white border-red-500"
      : ""
    : respuestasSupuesto[p.id] === 4
    ? "bg-blue-500 text-white border-blue-500"
    : ""
}

`}
  >
    D) {p.opcion_d}
  </button>

</div>

          </div>

        ))}

      </div>
<div className="mt-10 flex justify-center">

  <button
    onClick={() => {

      let aciertos = 0;
      let fallos = 0;
      let blancos = 0;

      preguntasSupuesto.forEach((p) => {

        const respuesta =
          respuestasSupuesto[p.id];

        if (respuesta === undefined) {
          blancos++;
        } else if (respuesta === p.correcta) {
          aciertos++;
        } else {
          fallos++;
        }

      });

      const nota =
        aciertos - fallos * 0.25;

      console.log({
        aciertos,
        fallos,
        blancos,
        nota,
      });

      setResultadoSupuesto({
        aciertos,
        fallos,
        blancos,
        nota,
      });
      setEstadisticasSupuestos((prev) => {

  const realizados =
    prev.realizados + 1;

  const aptos =
    nota >= 10
      ? prev.aptos + 1
      : prev.aptos;

  const noAptos =
    nota < 10
      ? prev.noAptos + 1
      : prev.noAptos;

  const mejorNota =
    Math.max(prev.mejorNota, nota);

  const media =
    (
      prev.media *
      prev.realizados +
      nota
    ) / realizados;

  return {
    realizados,
    aptos,
    noAptos,
    mejorNota,
    media,
  };

});
      setMostrarResultadoSupuesto(true);

    }}
    className="rounded-2xl bg-black px-8 py-5 text-white font-bold text-lg"
  >
    ✅ Corregir supuesto
  </button>

</div>
{mostrarResultadoSupuesto &&
 resultadoSupuesto && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

      <h2 className="mb-8 text-center text-4xl font-black">
        🎉 Resultado
      </h2>

      <div className="space-y-4 text-xl">

        <div>
          ✅ Aciertos: {resultadoSupuesto.aciertos}
        </div>

        <div>
          ❌ Fallos: {resultadoSupuesto.fallos}
        </div>

        <div>
          ⚪ Blancos: {resultadoSupuesto.blancos}
        </div>

        <div className="font-black text-2xl">
          📈 Nota: {resultadoSupuesto.nota}
        </div>

        <div className="text-2xl font-black">

          {resultadoSupuesto.nota >= 10
            ? "🟢 APTO"
            : "🔴 NO APTO"}

        </div>

      </div>

      <div className="mt-8 flex gap-4">

  <button
    onClick={() => {

      setMostrarResultadoSupuesto(false);

      setModoRevisionSupuesto(true);

    }}
    className="flex-1 rounded-2xl border p-4 font-bold"
  >
    Revisar respuestas
  </button>

  <button
  onClick={() => {

    setMostrarResultadoSupuesto(false);
    setResultadoSupuesto(null);
    setSupuestoSeleccionado(null);

  }}
  className="flex-1 rounded-2xl bg-black p-4 font-bold text-white"
>
  Cerrar
</button>

</div>

    </div>

  </div>

)}
    </main>

  );

}
  if (ejercicioSeleccionado === "SEGUNDO EJERCICIO") {

  return (
    <main className="min-h-screen p-10">

      <button
        onClick={() =>
          setEjercicioSeleccionado("")
        }
        className="mb-8 rounded-2xl bg-black px-5 py-3 text-white"
      >
        ⬅ Volver
      </button>

      <h1 className="text-5xl font-black mb-10">
        ✍️ Segundo ejercicio
      </h1>

      <div className="grid gap-6">

        {supuestos.map((supuesto) => (

          <div
            key={supuesto.id}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >

            <h2 className="text-3xl font-black mb-4">
              📄 {supuesto.titulo}
            </h2>

            <p className="text-gray-600 mb-6">
              {supuesto.enunciado.slice(0, 200)}...
            </p>

            <button
              onClick={async () => {

  setSupuestoSeleccionado(
    supuesto
  );

  await obtenerPreguntasSupuesto(
    supuesto.id
  );

}}
              className="rounded-2xl bg-black px-6 py-4 text-white font-bold"
            >
              Abrir supuesto
            </button>

          </div>

        ))}

      </div>

    </main>
  );
}
if (verEstadisticas) {

  return (

    <main className="min-h-screen p-10">

      <button
        onClick={() =>
          setVerEstadisticas(false)
        }
        className="mb-8 rounded-2xl bg-black px-5 py-3 text-white"
      >
        ⬅ Volver
      </button>

      <h1 className="text-5xl font-black mb-10">
        📊 Estadísticas
      </h1>

      <div className="grid gap-6">

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="text-3xl font-black mb-6">
            📘 Tests
          </h2>

          <div className="grid grid-cols-3 gap-4">

  <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Aciertos
    </p>

    <p className="text-4xl font-black">
      {aciertos}
    </p>

  </div>

  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Fallos
    </p>

    <p className="text-4xl font-black">
      {fallos}
    </p>

  </div>

  <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Ratio
    </p>

    <p className="text-4xl font-black">
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

        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <h2 className="text-3xl font-black mb-6">
            ✍️ Supuestos
          </h2>

          <div className="grid md:grid-cols-3 gap-4">

  <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Realizados
    </p>

    <p className="text-4xl font-black">
      {estadisticasSupuestos.realizados}
    </p>

  </div>

  <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Mejor nota
    </p>

    <p className="text-4xl font-black">
      {estadisticasSupuestos.mejorNota.toFixed(2)}
    </p>

  </div>

  <div className="rounded-2xl bg-cyan-500/10 border border-cyan-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Nota media
    </p>

    <p className="text-4xl font-black">
      {estadisticasSupuestos.media.toFixed(2)}
    </p>

  </div>

  <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      Aptos
    </p>

    <p className="text-4xl font-black">
      {estadisticasSupuestos.aptos}
    </p>

  </div>

  <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 text-center">

    <p className="text-sm font-bold text-zinc-500 mb-2">
      No aptos
    </p>

    <p className="text-4xl font-black">
      {estadisticasSupuestos.noAptos}
    </p>

  </div>

</div>

        </div>

      </div>

    </main>

  );

}
if (verSimulacro) {

  return (

    <main className="min-h-screen p-10">

      <button
        onClick={() =>
          setVerSimulacro(false)
        }
        className="mb-8 rounded-2xl bg-black px-5 py-3 text-white"
      >
        ⬅ Volver
      </button>

      <h1 className="text-5xl font-black mb-10">
        🎲 Simulacro
      </h1>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <p className="mb-4 font-bold">
          Número de preguntas
        </p>

        <div className="flex gap-2 mb-6">

          {[25, 50, 100].map((num) => (

            <button
              key={num}
              onClick={() =>
                setNumeroPreguntas(num)
              }
              className={`rounded-xl px-4 py-2 font-bold border

                ${
                  numeroPreguntas === num
                    ? "bg-black text-white"
                    : "bg-white"
                }

              `}
            >
              {num}
            </button>

          ))}

          <button
            onClick={() =>
              setNumeroPreguntas(9999)
            }
            className={`rounded-xl px-4 py-2 font-bold border

              ${
                numeroPreguntas === 9999
                  ? "bg-black text-white"
                  : "bg-white"
              }

            `}
          >
            Todas
          </button>

        </div>

        <p className="mb-4 font-bold">
          Bloques incluidos
        </p>

        <div className="grid md:grid-cols-2 gap-2 mb-8">

          {bloques.map((bloque) => (

            <label
              key={bloque.NOMBRE}
              className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer"
            >

              <input
                type="checkbox"
                checked={bloquesSimulacro.includes(
                  bloque.NOMBRE
                )}
                onChange={(e) => {

                  if (e.target.checked) {

                    setBloquesSimulacro([
                      ...bloquesSimulacro,
                      bloque.NOMBRE,
                    ]);

                  } else {

                    setBloquesSimulacro(
                      bloquesSimulacro.filter(
                        (b) =>
                          b !== bloque.NOMBRE
                      )
                    );

                  }

                }}
              />

              {bloque.NOMBRE}

            </label>

          ))}

        </div>

        <button
          onClick={async () => {

            const { data } = await supabase
              .from("PREGUNTAS")
              .select("*")
              .in(
                "BLOQUE",
                bloquesSimulacro.length > 0
                  ? bloquesSimulacro
                  : bloques.map(
                      (b) => b.NOMBRE
                    )
              )
              .range(0, 5000);

            if (data) {

              const mezcladas = data.sort(
                () => Math.random() - 0.5
              );

              setPreguntas(
                mezcladas.slice(
                  0,
                  numeroPreguntas
                )
              );

              setBloqueSeleccionado({
                NOMBRE: "SIMULACRO",
              });

              setIndicePregunta(0);

              setModoTest(true);

            }

          }}
          className="rounded-2xl bg-black px-8 py-5 text-white font-bold"
        >
          🚀 Empezar simulacro
        </button>

      </div>

    </main>

  );

}
if (ejercicioSeleccionado) {

  const bloquesEjercicio = bloques.filter(
    (b) => b.EJERCICIO === ejercicioSeleccionado
  );

  return (

    <main className="min-h-screen p-10">

      <button
        onClick={() =>
          setEjercicioSeleccionado("")
        }
        className="mb-8 rounded-2xl bg-black px-5 py-3 text-white"
      >
        ⬅ Volver
      </button>

      <h1 className="text-5xl font-black mb-10">
        {ejercicioSeleccionado}
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {bloquesEjercicio.map((bloque) => (

          <div
            key={bloque.NOMBRE}
            className="rounded-3xl bg-white/70 p-8 shadow-xl"
          >

            <h2 className="text-3xl font-black mb-6">
              📘 {bloque.NOMBRE}
            </h2>
<div className="flex gap-2 mb-6">

  {[10, 20, 50].map((num) => (

    <button
      key={num}
      onClick={() =>
        setNumeroPreguntas(num)
      }
      className={`rounded-xl px-4 py-2 font-bold border

        ${
          numeroPreguntas === num
            ? "bg-black text-white"
            : "bg-white"
        }

      `}
    >
      {num}
    </button>

  ))}

  <button
    onClick={() =>
      setNumeroPreguntas(9999)
    }
    className={`rounded-xl px-4 py-2 font-bold border

      ${
        numeroPreguntas === 9999
          ? "bg-black text-white"
          : "bg-white"
      }

    `}
  >
    Todas
  </button>

</div>
            <button
              onClick={async () => {

                setBloqueSeleccionado(bloque);

                const { data } = await supabase
                  .from("PREGUNTAS")
                  .select("*")
                  .eq("BLOQUE", bloque.NOMBRE);
                  console.log(
  bloque.NOMBRE,
  data?.length
);

                if (data) {

  const mezcladas = data.sort(
    () => Math.random() - 0.5
  );

  setPreguntas(
    mezcladas.slice(
      0,
      numeroPreguntas
    )
  );

}
setIndicePregunta(0);
                setModoTest(true);

              }}
              className="rounded-2xl bg-black px-6 py-4 text-white font-bold"
            >
              ▶️ Empezar test
            </button>

          </div>

        ))}

      </div>

    </main>

  );

}
  return (
    <main className="min-h-screen animate-fade bg-gradient-to-br from-zinc-100 via-slate-200 to-gray-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-10">
      <div className="flex gap-8">

  <aside className="w-72 shrink-0 rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] h-[calc(100vh-80px)] sticky top-10">

    <div className="mb-10">

      <h2 className="text-3xl font-black mb-2">
        ⚖️ Justicia
      </h2>

      <p className="text-zinc-500 dark:text-zinc-400">
        Plataforma de oposiciones
      </p>

    </div>

    <div className="space-y-3">

      <button
  onClick={() => setSeccionActiva("inicio")}
  className={`w-full rounded-2xl px-5 py-4 text-left font-bold transition-all

    ${
      seccionActiva === "inicio"
        ? "bg-black text-white"
        : "hover:bg-black/5 dark:hover:bg-white/5"
    }
  `}
>
  🏠 Inicio
</button>

      <button
  onClick={() => {

    setSeccionActiva("bd");

    setVerBaseDatos(true);

  }}
        className="w-full rounded-2xl px-5 py-4 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
      >
        🗄️ Base de datos
      </button>

      <button
        className={`w-full rounded-2xl px-5 py-4 text-left font-bold transition-all

  ${
    seccionActiva === "bd"
      ? "bg-black text-white"
      : "hover:bg-black/5 dark:hover:bg-white/5"
  }
`}
      >
        ❌ Fallos
      </button>

      <button
       onClick={() => setVerEstadisticas(true)}
        className="w-full rounded-2xl px-5 py-4 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
      >
  📊 Estadísticas
</button>
<button
  onClick={() => setVerSimulacro(true)}
  className="w-full rounded-2xl px-5 py-4 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
>
  🎲 Simulacro
</button>
<button
  onClick={() => {
    setEjercicioSeleccionado("PRIMER EJERCICIO");
  }}
  className="w-full rounded-2xl px-5 py-4 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
>
  ✍️ PRIMER EJERCICIO
</button>

<button
  onClick={async () => {
    await obtenerSupuestos();
    setEjercicioSeleccionado("SEGUNDO EJERCICIO");
  }}
  className="w-full rounded-2xl px-5 py-4 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
>
  ✍️ SEGUNDO EJERCICIO
</button>

<button
  onClick={() => {
    setEjercicioSeleccionado("TERCER EJERCICIO");
  }}
  className="w-full rounded-2xl px-5 py-4 text-left font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
>
  ✍️ TERCER EJERCICIO
</button>

    </div>

  </aside>

  <div className="flex-1">

        <div className="flex justify-end mb-6">

  <button
    onClick={() => setDarkMode(!darkMode)}
    className="rounded-full bg-black text-white px-4 py-2 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

</div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex justify-end mb-10">

  <div className="relative w-[380px]">

  </div>

</div>

  <div>

    <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">
      Plataforma de estudio
    </p>

    <h2 className="text-3xl font-black">
      Bienvenida 👋
    </h2>

  </div>

  <div className="flex items-center gap-4">

    <div className="rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 px-5 py-3 shadow-lg">
      <p className="font-bold">
        ⚡ Premium
      </p>
    </div>

  </div>

</div>
<div className="grid md:grid-cols-3 gap-6 mb-12">

  <div className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

    <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-3">
      📚 Preguntas
    </p>

    <h3 className="text-5xl font-black">
      {preguntas.length}
    </h3>

  </div>

  <div className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

    <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-3">
      🔥 Ratio
    </p>

    <h3 className="text-5xl font-black">
      {aciertos + fallos > 0
        ? Math.round(
            (aciertos /
              (aciertos + fallos)) *
              100
          )
        : 0}
      %
    </h3>

  </div>

  <div className="rounded-[28px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

    <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-3">
      ⚡ Tests
    </p>

    <h3 className="text-5xl font-black">
      {aciertos + fallos}
    </h3>

  </div>

</div>

</div>

<div className="mb-16">

  <h1 className="text-7xl md:text-8xl font-black leading-none mb-6 bg-gradient-to-r from-black to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">

    Oposiciones
    <br />
    Justicia


  </h1>

  <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">


    Practica test oficiales, simulacros y seguimiento de progreso
    en una plataforma moderna diseñada para opositores.

  </p>

</div>

<div className="rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] mb-14">

  <div className="flex items-center justify-between mb-8">

    <div>

      <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-2">
        Rendimiento
      </p>

      <h2 className="text-4xl font-black">
        Evolución semanal
      </h2>

    </div>

    <div className="rounded-2xl bg-green-500/10 border border-green-500/20 px-5 py-3">

      <p className="font-bold text-green-600">
        ↗ +12%
      </p>

    </div>

  </div>

  <div className="h-[260px] w-full min-w-0">

    <ResponsiveContainer width="99%" height={260}>

      <LineChart data={datosGrafico}>

        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={5}
          dot={false}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>
  </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
  onClick={() => setVerBaseDatos(true)}
  className="group relative overflow-hidden rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] cursor-pointer hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500"
>

  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/20 transition-all duration-500" />

  <div className="relative z-10">

    <div className="text-6xl mb-6">
      🗄️
    </div>

    <h2 className="text-3xl font-black mb-3">
      Base de datos
    </h2>

    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
      Gestiona preguntas, edita contenido y administra bloques.
    </p>
<button
  onClick={() => setVerBaseDatos(true)}
  className="mt-8 rounded-2xl bg-gradient-to-br from-black to-zinc-800 px-6 py-4 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
>
  🗄️ Abrir base de datos
</button>
  </div>

</div>

          <div
  className="group relative overflow-hidden rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500"
>

  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/20 transition-all duration-500" />

  <div className="relative z-10">

    <div className="text-6xl mb-6">
      ❌
    </div>

    <h2 className="text-3xl font-black mb-3">
      Fallos
    </h2>

    <p className="mb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
      Practica únicamente las preguntas falladas para reforzar memoria.
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
      className="rounded-2xl bg-gradient-to-br from-black to-zinc-800 px-6 py-4 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
    >
      ▶️ Practicar fallos
    </button>

  </div>

</div>

          <div
  onClick={() => setVerEstadisticas(true)}
  className="group relative overflow-hidden rounded-[32px] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/50 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] cursor-pointer hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500"
>
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-violet-500/0 group-hover:from-blue-500/10 group-hover:to-violet-500/20 transition-all duration-500" />

  <div className="relative z-10">

    <div className="text-6xl mb-6">
  📊
</div>

<h2 className="text-3xl font-black mb-3">
  Estadísticas
</h2>

<p className="mb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
  Consulta tu progreso, resultados y evolución
  en tests y supuestos.
</p>

<button
  onClick={() => setVerEstadisticas(true)}
  className="rounded-2xl bg-gradient-to-br from-black to-zinc-800 px-6 py-4 text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
>
  📊 Ver estadísticas
</button>

          </div>

      </div>

    </div>

  </div>

</main>
  );
}