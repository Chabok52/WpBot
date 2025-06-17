const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")
const tituloPath = path.join(__dirname, "mensajes", "titulo.txt")
const titulo = fs.readFileSync(tituloPath, "utf8")
const equivalenciasPath = path.join(__dirname, "mensajes", "equivalencias.txt")
const equivalencias = fs.readFileSync(equivalenciasPath, "utf8")
const bajaPath = path.join(__dirname, "mensajes", "baja.txt")
const baja = fs.readFileSync(bajaPath, "utf8")
const constanciaPath = path.join(__dirname, "mensajes", "constancia.txt")
const constancia = fs.readFileSync(constanciaPath, "utf8")
const horariosPath = path.join(__dirname, "mensajes", "horarios.txt")
const horarios = fs.readFileSync(horariosPath, "utf8")
const inscripcionPath = path.join(__dirname, "mensajes", "inscripcion.txt")
const inscripcion = fs.readFileSync(inscripcionPath, "utf8")
const materiasPath = path.join(__dirname, "mensajes", "materias.txt")
const materias = fs.readFileSync(materiasPath, "utf8")
const examenesPath = path.join(__dirname, "mensajes", "examenes.txt")
const examenes = fs.readFileSync(examenesPath, "utf8")

// Flujos secundarios
const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer([
    '📄 Aquí tenemos el flujo secundario',
    'Escribe *menu* para volver al menú principal'
])

const flowExamenes = addKeyword(['fecha examenes', 'Fecha examenes', 'Fecha Examenes']).addAnswer(
    examenes,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        },
        [flowSecundario])

const flowMaterias = addKeyword(['fecha materias', 'Fecha Materias', 'Fecha materias', 'FECHA MATERIAS']).addAnswer(
    materias,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        }, 
        [flowSecundario])

const flowInscripcion = addKeyword(['Inscripcion', 'inscripcion']).addAnswer(
    inscripcion,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        },
    [flowSecundario])

const normalizarTexto = (texto) => {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^\w\s]/gi, '')
        .trim()
}

const flowHorarios = addKeyword(['Horarios', 'horarios', 'HORARIOS'])
    .addAnswer(horarios,
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic, fallBack, state }) => {
            const entradaNormalizada = normalizarTexto(ctx.body)

            const pdfs = {
                'ingenieria en computacion': 'https://drive.google.com/horarios/ingenieria-computacion.pdf',
                'abogacia': 'https://drive.google.com/horarios/abogacia.pdf',
                'contador publico': 'https://drive.google.com/horarios/contabilidad.pdf'
            }

            if (entradaNormalizada === 'menu') {
                return gotoFlow(flowMenu)
            }

            if (pdfs[entradaNormalizada]) {
                await flowDynamic([
                    `✅ Aquí está el PDF de horarios para *${ctx.body}*:`,
                    pdfs[entradaNormalizada],
                    'Escribe *menu* para volver al menú principal.'
                ])
            } else {
                await flowDynamic([
                    `❌ No encontré horarios para *${ctx.body}*.`,
                    'Asegurate de ingresar el nombre completo de tu carrera.',
                    'Ej: "ingenieria en computacion", "abogacia", "contador publico"',
                    'Intentá nuevamente o escribe *menu* para volver al menú principal.'
                ])
                return fallBack() // vuelve a capturar en el mismo flujo
            }
        },
        [flowSecundario])

const flowConstancia = addKeyword(['Constancia, constancia']).addAnswer(
    constancia,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        },
        [flowSecundario])

const flowBaja = addKeyword(['Baja', 'baja']).addAnswer(baja,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        },
        [flowSecundario])

const flowEquivalencias = addKeyword(['Equivalencias', 'equivalencias']).addAnswer(
    equivalencias,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        },
        [flowSecundario])

const flowTitulo = addKeyword(['Titulo', 'titulo']).addAnswer(
    titulo,
    { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (ctx.body.toLowerCase() !== 'menu') {
                return fallBack('❌ Opción no válida. Por favor escribe *menu* para volver al menú, o simplemente no respondas si ya has terminado tu trámite.')
            }
            return gotoFlow(flowMenu)
        },
        [flowSecundario])

const flowSupervisor = addKeyword(['Supervisor', 'supervisor']).addAnswer([
    'Por favor espere mientras el supervisor toma control del chat'
])

const flowMenu = addKeyword([EVENTS.WELCOME])
    .addAnswer(
        menu,
        { capture: true },
        async (ctx, { gotoFlow, fallBack }) => {
            if (!['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(ctx.body)) {
                return fallBack('❌ Opción no válida. Por favor elige el número que corresponda a la opción que desee acceder.')
            }

            switch(ctx.body) {
                case '1': return gotoFlow(flowMaterias)
                case '2': return gotoFlow(flowExamenes)
                case '3': return gotoFlow(flowInscripcion)
                case '4': return gotoFlow(flowHorarios)
                case '5': return gotoFlow(flowConstancia)
                case '6': return gotoFlow(flowBaja)
                case '7': return gotoFlow(flowEquivalencias)
                case '8': return gotoFlow(flowTitulo)
                case '9': return gotoFlow(flowSupervisor)
            }
        },
        [flowMaterias, flowExamenes, flowInscripcion, flowHorarios, flowConstancia, flowBaja, flowTitulo, flowEquivalencias, flowSupervisor, flowSecundario])

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        flowMenu,
        flowMaterias,
        flowExamenes,
        flowInscripcion,
        flowHorarios,
        flowConstancia,
        flowBaja,
        flowTitulo,
        flowEquivalencias,
        flowSupervisor,
        flowSecundario
    ])

    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

const http = require('http')

const PORT = process.env.PORT || 3000
http.createServer((req, res) => {
    res.writeHead(200)
    res.end('Bot WhatsApp funcionando en Railway 🚀')
}).listen(PORT, () => {
    console.log(`Servidor HTTP activo en puerto ${PORT}`)
})
