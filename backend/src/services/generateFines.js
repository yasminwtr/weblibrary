import cron from 'node-cron'
import { prisma } from '../lib/prisma.js'

const DAILY_FINE_VALUE = 0.50

async function generateFines() {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // 1. Atualiza o status para "Atrasado" se já passou da data de devolução
  await prisma.loan.updateMany({
    where: {
      returnedAt: null,
      dueDate: { lt: today },
      status: { not: 'Atrasado' }
    },
    data: { status: 'Atrasado' }
  })

  // 2. Busca todos os empréstimos atrasados ainda não devolvidos
  const overdueLoans = await prisma.loan.findMany({
    where: {
      status: 'Atrasado',
      returnedAt: null
    },
    include: {
      user: true,
      fines: true
    }
  })

  // 3. Gera uma multa por dia de atraso (se ainda não tiver sido gerada hoje)
  for (const loan of overdueLoans) {
    const dueDate = new Date(loan.dueDate)
    const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))

    if (daysLate > 0) {
      const alreadyFinedToday = loan.fines.some(fine => {
        const fineDateStr = new Date(fine.createdAt).toISOString().split('T')[0]
        return fineDateStr === todayStr
      })

      if (!alreadyFinedToday) {
        await prisma.fine.create({
          data: {
            userId: loan.userId,
            loanId: loan.id,
            amount: DAILY_FINE_VALUE
          }
        })

        console.log(
          `Multa de R$ ${DAILY_FINE_VALUE.toFixed(2)} gerada para usuário ${loan.user.name} (empréstimo #${loan.id})`
        )
      }
    }
  }
}

cron.schedule('0 0 * * *', async () => {
  console.log('Rodando script automático de geração de multas...')
  try {
    await generateFines()
    console.log('Script de multas finalizado com sucesso.')
  } catch (err) {
    console.error('Erro ao gerar multas:', err)
  }
})