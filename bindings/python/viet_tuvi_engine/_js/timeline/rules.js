export function minorLimitStart(yearBranch) {
    if ([2, 6, 10].includes(yearBranch))
        return 4;
    if ([8, 0, 4].includes(yearBranch))
        return 10;
    if ([5, 9, 1].includes(yearBranch))
        return 7;
    return 1;
}
