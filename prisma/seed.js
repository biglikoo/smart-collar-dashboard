const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const RAW_MOCK_DATA = [
  { id: "Yankasa_01", shortName: "Ram 01 · Yankasa", diagnostic_flag: 1, battery_mv: 3934, core_temp_c: 39.1, env_temp_c: 31.2, resp_rate: 20, dai: 72 },
  { id: "Ouda_02",    shortName: "Ram 02 · Ouda",    diagnostic_flag: 0, battery_mv: 3822, core_temp_c: 38.6, env_temp_c: 31.2, resp_rate: 17, dai: 40 },
  { id: "Yankasa_03", shortName: "Ram 03 · Yankasa", diagnostic_flag: 2, battery_mv: 3756, core_temp_c: 39.8, env_temp_c: 31.5, resp_rate: 28, dai: 68 },
  { id: "Ouda_04",    shortName: "Ram 04 · Ouda",    diagnostic_flag: 6, battery_mv: 3690, core_temp_c: 41.2, env_temp_c: 31.2, resp_rate: 38, dai: 18 },
  { id: "Yankasa_05", shortName: "Ram 05 · Yankasa", diagnostic_flag: 1, battery_mv: 3991, core_temp_c: 38.9, env_temp_c: 31.3, resp_rate: 22, dai: 80 },
  { id: "Ouda_06",    shortName: "Ram 06 · Ouda",    diagnostic_flag: 1, battery_mv: 3528, core_temp_c: 38.7, env_temp_c: 31.4, resp_rate: 19, dai: 55 },
  { id: "Yankasa_07", shortName: "Ram 07 · Yankasa", diagnostic_flag: 5, battery_mv: 3864, core_temp_c: 38.4, env_temp_c: 31.2, resp_rate: 16, dai: 35 },
  { id: "Ouda_08",    shortName: "Ram 08 · Ouda",    diagnostic_flag: 3, battery_mv: 3792, core_temp_c: 39.5, env_temp_c: 31.5, resp_rate: 26, dai: 64 },
  { id: "Yankasa_09", shortName: "Ram 09 · Yankasa", diagnostic_flag: 1, battery_mv: 3906, core_temp_c: 38.8, env_temp_c: 31.3, resp_rate: 21, dai: 78 },
  { id: "Ouda_10",    shortName: "Ram 10 · Ouda",    diagnostic_flag: 4, battery_mv: 3714, core_temp_c: 40.8, env_temp_c: 31.1, resp_rate: 18, dai: 42 },
  { id: "Yankasa_11", shortName: "Ram 11 · Yankasa", diagnostic_flag: 1, battery_mv: 4020, core_temp_c: 39.0, env_temp_c: 31.2, resp_rate: 23, dai: 85 },
  { id: "Ouda_12",    shortName: "Ram 12 · Ouda",    diagnostic_flag: 1, battery_mv: 3828, core_temp_c: 38.8, env_temp_c: 31.4, resp_rate: 20, dai: 61 },
]

const DIAGNOSTIC_STATE_MAP = {
  0: { label: "Resting",              category: "normal" },
  1: { label: "Grazing",              category: "normal" },
  2: { label: "Ambulating",           category: "normal" },
  3: { label: "Agitated",             category: "warning" },
  4: { label: "Feverish",             category: "pathogenic" },
  5: { label: "Sluggish",             category: "pathogenic" },
  6: { label: "Respiratory Distress", category: "pathogenic" },
}

async function main() {
  console.log('Seeding initial mock data to SQLite...')
  
  for (const ram of RAW_MOCK_DATA) {
    const breed = ram.id.includes("Ouda") ? "Ouda" : "Yankasa"
    const stateInfo = DIAGNOSTIC_STATE_MAP[ram.diagnostic_flag]
    const status = stateInfo.category === "pathogenic" ? "ALERT" : "ONLINE"
    const state_label = stateInfo.label

    await prisma.collar.upsert({
      where: { id: ram.id },
      update: { last_seen: new Date(), status },
      create: {
        id: ram.id,
        breed,
        last_seen: new Date(),
        status
      }
    })

    await prisma.telemetry.create({
      data: {
        device_id: ram.id,
        battery_mv: ram.battery_mv,
        diagnostic_flag: ram.diagnostic_flag,
        state_label,
        core_temp_c: ram.core_temp_c,
        env_temp_c: ram.env_temp_c,
        resp_rate: ram.resp_rate,
        dai: ram.dai
      }
    })
  }

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
