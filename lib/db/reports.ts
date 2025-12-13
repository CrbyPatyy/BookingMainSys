
export interface DailyRevenue {
    date: string
    revenue: number
    occupancy: number
}

export interface SourceStat {
    source: string
    count: number
    percentage: number
    color: string
}

export interface OccupancyStat {
    status: string
    count: number
    color: string
}

// TODO: Connect to real database - returns empty data for now
export const getRevenueData = (): DailyRevenue[] => {
    // Replace with real database query
    return []
}

// TODO: Connect to real database - returns empty data for now
export const getSourceData = (): SourceStat[] => {
    // Replace with real database query
    return []
}

// TODO: Connect to real database - returns empty data for now
export const getOccupancyStats = (): OccupancyStat[] => {
    // Replace with real database query
    return []
}

// TODO: Connect to real database - returns default values for now
export const getKeyMetrics = () => {
    // Replace with real database query
    return {
        revpar: 0,
        adr: 0,
        occupancyRate: 0,
        totalRevenue: 0
    }
}
