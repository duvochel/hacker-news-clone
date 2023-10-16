import { UserResolvers } from "@/__generated__/resolvers-types";

function links(parent: any, args: any, context: any) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links();
}

const user: UserResolvers = {
  links
};

export default user;
