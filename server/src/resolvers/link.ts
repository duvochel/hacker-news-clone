function postedBy(parent: any, args: any, context: any) {
  return context.prisma.link
    .findUnique({ where: { id: parent.id } })
    .postedBy();
}

function votes(parent: any, args: any, context: any) {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
}

const link = {
  postedBy,
  votes
};

export default link;
