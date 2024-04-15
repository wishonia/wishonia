import prisma from '.'

export async function getUsers() {
  try {
    const users = await prisma.user.findMany()
    
    return { users }
  } catch (error) {
    return { error }
  }
}

export async function getUsersWithReferrerCount() {
  try {
    // Step 1: Fetch all users
    const users = await prisma.user.findMany();

    // Step 2: Create a map for referrerUserId counts
    const referralCounts = users.reduce((acc: Record<string, number>, user) => {
      if (user.referrerUserId) {
        acc[user.referrerUserId] = (acc[user.referrerUserId] || 0) + 1;
      }
      return acc;
    }, {});

    // Step 3 & 4: Attach referralCount to each user
    const usersWithReferralCount = users.map(user => ({
      ...user,
      referralCount: referralCounts[user.id] || 0, // Default to 0 if no referrals
    }));

    return { users: usersWithReferralCount };
  } catch (error) {
    return { error };
  }
}

export async function createUser(user: any) {
  try {
    const userFromDB = await prisma.user.create({ data: user })
    return { user: userFromDB }
  } catch (error) {
    return { error } 
  }
}

export async function updateUser(email: any, data: any) {
  try {
    await prisma.user.update({
      where: { email },
      data: data,
    });
    return { data }
  } catch (error) {
    return { error }
  }
}

export async function deleteUser(email: any) {
  try {
    await prisma.user.delete({
      where: { email },
    });
  } catch (error) {
    return { error }
  }
}

export async function getUserById(id: any) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      }
    })
    return { user}
  } catch (error) {
    return { error }
  }
}

export async function getUserByEmail(email: any) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return user;
    } else {
      return "User not found";
    }
  } catch (error) {
    return { error };
  }
}