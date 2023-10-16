function link(parent: any, args: any, context: any) {
  return context.prisma.vote.findUnique({ where: { id: parent.id } }).link();
}

function user(parent: any, args: any, context: any) {
  return context.prisma.vote.findUnique({ where: { id: parent.id } }).user();
}

const vote = {
  link,
  user
};

export default vote;
