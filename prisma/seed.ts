import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Cores ANSI para console
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

async function main() {
  console.log(colors.cyan + 'Iniciando seed do banco de dados...' + colors.reset);

  // Limpar dados existentes
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.usuario.deleteMany();

  console.log(colors.green + 'Dados antigos limpos' + colors.reset);

  // Usuários
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  const senhaCliente = await bcrypt.hash('123456', 10);

  const usuarios = await prisma.usuario.createMany({
    data: [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        nome: 'Administrador Sistema',
        email: 'admin@overzone.com',
        senhaHash: senhaAdmin,
        tipo: 'ADMIN',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        nome: 'João Silva',
        email: 'joao@email.com',
        senhaHash: senhaCliente,
        tipo: 'CLIENTE',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        nome: 'Maria Santos',
        email: 'maria@email.com',
        senhaHash: senhaCliente,
        tipo: 'CLIENTE',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        nome: 'Carlos Oliveira',
        email: 'carlos@email.com',
        senhaHash: senhaCliente,
        tipo: 'CLIENTE',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        nome: 'Ana Costa',
        email: 'ana@email.com',
        senhaHash: senhaCliente,
        tipo: 'CLIENTE',
      },
    ],
  });

  console.log(colors.green + `${usuarios.count} usuários criados` + colors.reset);

  // Produtos
  const produtos = await prisma.produto.createMany({
    data: [
      {
        id: '650e8400-e29b-41d4-a716-446655440001',
        nome: 'Notebook Gamer Ultra RTX 4060',
        descricao:
          'Notebook gamer de alta performance com processador Intel Core i7 13ª geração, 16GB RAM DDR5, SSD NVMe 512GB, placa de vídeo NVIDIA GeForce RTX 4060 8GB, tela 15.6" Full HD 144Hz, teclado retroiluminado RGB.',
        quantidade: 15,
        preco: 5999.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440002',
        nome: 'Notebook Profissional MacBook Air M2',
        descricao:
          'Apple MacBook Air 2024 com chip M2, 8GB RAM unificada, SSD 256GB, tela Retina 13.6" com True Tone, bateria de até 18 horas, design ultrafino em alumínio.',
        quantidade: 8,
        preco: 8999.0,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440003',
        nome: 'Notebook Básico para Estudos',
        descricao:
          'Notebook ideal para estudos e trabalho básico, processador Intel Core i3 11ª geração, 8GB RAM, SSD 256GB, tela 14" HD, Windows 11 Home, peso de apenas 1.5kg.',
        quantidade: 25,
        preco: 2499.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440004',
        nome: 'Mouse Gamer RGB 16000 DPI',
        descricao:
          'Mouse gamer de alta precisão com sensor óptico de 16.000 DPI ajustável, iluminação RGB customizável com 16.8 milhões de cores, 8 botões programáveis, cabo trançado resistente, peso ajustável.',
        quantidade: 50,
        preco: 249.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440005',
        nome: 'Teclado Mecânico RGB Switch Blue',
        descricao:
          'Teclado mecânico gamer com switches blue (clicky), iluminação RGB por tecla com efeitos personalizáveis, anti-ghosting completo, estrutura em alumínio premium, teclas double-shot PBT, descanso para pulso magnético.',
        quantidade: 35,
        preco: 599.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440006',
        nome: 'Headset Gamer 7.1 Surround',
        descricao:
          'Headset gamer com som surround virtual 7.1, drivers de 50mm, microfone removível com cancelamento de ruído, almofadas em couro sintético confortáveis, iluminação RGB, compatível com PC, PS5 e Xbox.',
        quantidade: 40,
        preco: 399.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440007',
        nome: 'Webcam Full HD 1080p 60fps',
        descricao:
          'Webcam profissional com resolução 1080p 60fps, foco automático, correção de iluminação automática, microfone duplo integrado com redução de ruído, tripé ajustável, ideal para streaming e videoconferências.',
        quantidade: 30,
        preco: 449.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440008',
        nome: 'Monitor Gamer 27" 165Hz Curvo',
        descricao:
          'Monitor gamer curvo de 27 polegadas, painel VA, resolução QHD 2560x1440, taxa de atualização de 165Hz, tempo de resposta 1ms, tecnologia FreeSync Premium, HDR10, suporte VESA.',
        quantidade: 12,
        preco: 1899.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440009',
        nome: 'Monitor Profissional 24" IPS 4K',
        descricao:
          'Monitor profissional para design e edição, painel IPS de 24 polegadas, resolução 4K Ultra HD, cobertura de cor sRGB 99%, calibração de fábrica, ajuste de altura e rotação, USB-C com DisplayPort.',
        quantidade: 10,
        preco: 2299.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440010',
        nome: 'SSD NVMe 1TB PCIe 4.0',
        descricao:
          'SSD NVMe M.2 de 1TB com interface PCIe 4.0 x4, velocidades de leitura sequencial de até 7000MB/s e gravação de 5000MB/s, controlador de última geração, cache DRAM, garantia de 5 anos.',
        quantidade: 45,
        preco: 699.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440011',
        nome: 'Memória RAM 16GB DDR4 3200MHz',
        descricao:
          'Kit de memória RAM 16GB (2x8GB) DDR4 3200MHz, latência CL16, dissipador de calor em alumínio, compatível com Intel e AMD, perfil XMP 2.0 para overclock automático.',
        quantidade: 60,
        preco: 349.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440012',
        nome: 'Placa de Vídeo RTX 3060 12GB',
        descricao:
          'Placa de vídeo NVIDIA GeForce RTX 3060 com 12GB GDDR6, arquitetura Ampere, Ray Tracing de 2ª geração, DLSS 2.0, sistema de resfriamento com 3 ventoinhas, backplate em metal.',
        quantidade: 8,
        preco: 2499.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440013',
        nome: 'Cadeira Gamer Ergonômica Premium',
        descricao:
          'Cadeira gamer profissional com design ergonômico, apoio lombar ajustável, almofadas em espuma de alta densidade, revestimento em couro PU premium, reclinável até 180 graus, braços 4D ajustáveis, suporta até 150kg.',
        quantidade: 18,
        preco: 1599.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440014',
        nome: 'Mesa Gamer com LED RGB',
        descricao:
          'Mesa gamer com tampo em MDF reforçado 120x60cm, suporte para monitor, gancho para headset, porta-copos, iluminação LED RGB integrada, gerenciador de cabos, pés niveladores.',
        quantidade: 10,
        preco: 899.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440015',
        nome: 'Hub USB-C 7 em 1',
        descricao:
          'Hub USB-C multifuncional com 3 portas USB 3.0, HDMI 4K, leitor de cartão SD/microSD, porta USB-C PD de 100W para carregamento, cabo integrado, compatível com MacBook, notebooks e tablets.',
        quantidade: 55,
        preco: 199.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440016',
        nome: 'Mousepad Gamer XXL RGB',
        descricao:
          'Mousepad gamer tamanho extra grande 90x40cm, superfície em tecido de alta velocidade, base antiderrapante em borracha, bordas costuradas, iluminação RGB nas bordas com controle por software.',
        quantidade: 70,
        preco: 149.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440017',
        nome: 'Suporte Articulado para Monitor',
        descricao:
          'Suporte articulado para monitor de 13" a 32", montagem em mesa com braço ajustável, rotação 360°, inclinação +85°/-15°, ajuste de altura, gerenciamento de cabos integrado, suporta até 8kg.',
        quantidade: 22,
        preco: 299.9,
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440018',
        nome: 'Microfone Condensador USB',
        descricao:
          'Microfone condensador USB profissional para streaming e podcast, padrão polar cardioide, frequência de resposta 20Hz-20kHz, montagem anti-vibração, filtro pop incluído, controle de ganho, botão mute.',
        quantidade: 28,
        preco: 549.9,
      },
    ],
  });

  console.log(colors.green + `${produtos.count} produtos criados` + colors.reset);

  // Pedidos
  const pedido1 = await prisma.pedido.create({
    data: {
      id: '750e8400-e29b-41d4-a716-446655440001',
      usuarioId: '550e8400-e29b-41d4-a716-446655440002',
      total: 10149.5,
      status: 'ENTREGUE',
      data: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.itemPedido.createMany({
    data: [
      {
        id: '850e8400-e29b-41d4-a716-446655440001',
        pedidoId: pedido1.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440001',
        quantidade: 1,
        precoUnitario: 5999.9,
        subtotal: 5999.9,
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440002',
        pedidoId: pedido1.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440004',
        quantidade: 1,
        precoUnitario: 249.9,
        subtotal: 249.9,
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440003',
        pedidoId: pedido1.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440005',
        quantidade: 1,
        precoUnitario: 599.9,
        subtotal: 599.9,
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440004',
        pedidoId: pedido1.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440006',
        quantidade: 1,
        precoUnitario: 399.9,
        subtotal: 399.9,
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440005',
        pedidoId: pedido1.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440008',
        quantidade: 1,
        precoUnitario: 1899.9,
        subtotal: 1899.9,
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440006',
        pedidoId: pedido1.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440013',
        quantidade: 1,
        precoUnitario: 1599.9,
        subtotal: 1599.9,
      },
    ],
  });

  const pedido2 = await prisma.pedido.create({
    data: {
      id: '750e8400-e29b-41d4-a716-446655440002',
      usuarioId: '550e8400-e29b-41d4-a716-446655440003',
      total: 3549.7,
      status: 'ENVIADO',
      data: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.itemPedido.createMany({
    data: [
      {
        pedidoId: pedido2.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440012',
        quantidade: 1,
        precoUnitario: 2499.9,
        subtotal: 2499.9,
      },
      {
        pedidoId: pedido2.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440010',
        quantidade: 1,
        precoUnitario: 699.9,
        subtotal: 699.9,
      },
      {
        pedidoId: pedido2.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440011',
        quantidade: 1,
        precoUnitario: 349.9,
        subtotal: 349.9,
      },
    ],
  });

  const pedido3 = await prisma.pedido.create({
    data: {
      id: '750e8400-e29b-41d4-a716-446655440003',
      usuarioId: '550e8400-e29b-41d4-a716-446655440004',
      total: 1399.7,
      status: 'PROCESSANDO',
      data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.itemPedido.createMany({
    data: [
      {
        pedidoId: pedido3.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440005',
        quantidade: 1,
        precoUnitario: 599.9,
        subtotal: 599.9,
      },
      {
        pedidoId: pedido3.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440006',
        quantidade: 1,
        precoUnitario: 399.9,
        subtotal: 399.9,
      },
      {
        pedidoId: pedido3.id,
        produtoId: '650e8400-e29b-41d4-a716-446655440007',
        quantidade: 1,
        precoUnitario: 449.9,
        subtotal: 449.9,
      },
    ],
  });

  console.log(colors.green + 'Pedidos e itens criados' + colors.reset);

  // Estatísticas
  const totalUsuarios = await prisma.usuario.count();
  const totalProdutos = await prisma.produto.count();
  const totalPedidos = await prisma.pedido.count();
  const totalItens = await prisma.itemPedido.count();

  console.log(colors.yellow + '\nEstatísticas:' + colors.reset);
  console.log(`   Usuários: ${totalUsuarios}`);
  console.log(`   Produtos: ${totalProdutos}`);
  console.log(`   Pedidos: ${totalPedidos}`);
  console.log(`   Itens de Pedido: ${totalItens}`);

  console.log(colors.green + '\nSeed concluído com sucesso!' + colors.reset);
  console.log(colors.cyan + '\nCredenciais de Login:' + colors.reset);
  console.log('   Admin: admin@overzone.com / admin123');
  console.log('   Cliente: joao@email.com / 123456');
}

main()
  .catch((e) => {
    console.error(colors.red + 'Erro ao executar seed:' + colors.reset, e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
