import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data: {
            id: 'cb57fca2-4a6e-4ba9-83e4-7d10c2d10f84',
            title: 'DevOps Summit',
            slug: 'devops-summit',
            details: 'Tech dev and DevOps in Agile Culture',
            maximumAttendees: 300,
        }
    })
}

seed().then(() => {
    console.log('Database seeded.')
    prisma.$disconnect()
}) 
