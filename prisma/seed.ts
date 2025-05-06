const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create initial Quran sections (30 paras)
  for (let i = 1; i <= 30; i++) {
    await prisma.quranSection.upsert({
      where: { id: `para-${i}` },
      update: {},
      create: {
        id: `para-${i}`,
        paraNumber: i,
        name: `Para ${i}`,
        totalVerses: 0, // You would populate this with actual data
      },
    })
  }

  // Create initial Khatm
  await prisma.khatm.upsert({
    where: { id: 'initial-khatm' },
    update: {},
    create: {
      id: 'initial-khatm',
      khatmNumber: 1,
      goalType: 'day',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      totalParticipants: 0,
      sectionsCompleted: 0,
      totalSections: 30,
      isActive: true,
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 