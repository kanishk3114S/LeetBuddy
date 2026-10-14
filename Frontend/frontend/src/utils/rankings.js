export const calculateRank = (leetBuddyPoints) => {
    const points = Number(leetBuddyPoints) || 0;
    if (points >= 10001) return { title: "LeetGOAT", tier: 11, color: "#FFD700", minPoints: 10001, maxPoints: Infinity };
    if (points >= 7001)  return { title: "LeetKing", tier: 10, color: "#E63946", minPoints: 7001, maxPoints: 10000 };
    if (points >= 5001)  return { title: "Champion", tier: 9, color: "#9D4EDD", minPoints: 5001, maxPoints: 7000 };
    if (points >= 4001)  return { title: "UltimateGrindmaster", tier: 8, color: "#FFB703", minPoints: 4001, maxPoints: 5000 };
    if (points >= 3001)  return { title: "Grindmaster", tier: 7, color: "#FB8500", minPoints: 3001, maxPoints: 4000 };
    if (points >= 2501)  return { title: "Conqueror", tier: 6, color: "#2A9D8F", minPoints: 2501, maxPoints: 3000 };
    if (points >= 2001)  return { title: "Veteran", tier: 5, color: "#2EC4B6", minPoints: 2001, maxPoints: 2500 };
    if (points >= 1501)  return { title: "Grinder", tier: 4, color: "#00F5D4", minPoints: 1501, maxPoints: 2000 };
    if (points >= 1001)  return { title: "Warrior", tier: 3, color: "#48CAE4", minPoints: 1001, maxPoints: 1500 };
    if (points >= 501)   return { title: "Challenger", tier: 2, color: "#4CC9F0", minPoints: 501, maxPoints: 1000 };
    return { title: "Rookie", tier: 1, color: "#6C757D", minPoints: 0, maxPoints: 500 };
};

export const RANKS_LIST = [
    { title: "Rookie", tier: 1, color: "#6C757D", minPoints: 0, maxPoints: 500 },
    { title: "Challenger", tier: 2, color: "#4CC9F0", minPoints: 501, maxPoints: 1000 },
    { title: "Warrior", tier: 3, color: "#48CAE4", minPoints: 1001, maxPoints: 1500 },
    { title: "Grinder", tier: 4, color: "#00F5D4", minPoints: 1501, maxPoints: 2000 },
    { title: "Veteran", tier: 5, color: "#2EC4B6", minPoints: 2001, maxPoints: 2500 },
    { title: "Conqueror", tier: 6, color: "#2A9D8F", minPoints: 2501, maxPoints: 3000 },
    { title: "Grindmaster", tier: 7, color: "#FB8500", minPoints: 3001, maxPoints: 4000 },
    { title: "UltimateGrindmaster", tier: 8, color: "#FFB703", minPoints: 4001, maxPoints: 5000 },
    { title: "Champion", tier: 9, color: "#9D4EDD", minPoints: 5001, maxPoints: 7000 },
    { title: "LeetKing", tier: 10, color: "#E63946", minPoints: 7001, maxPoints: 10000 },
    { title: "LeetGOAT", tier: 11, color: "#FFD700", minPoints: 10001, maxPoints: Infinity }
];
