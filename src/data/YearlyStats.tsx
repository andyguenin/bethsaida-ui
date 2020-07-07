import Stats from "./Stats";

export default interface YearlyStats {
    previous_year: Stats,
    current_year: Stats,
    current_year_proj: Stats,
    previous_year_white: number,
    current_year_white: number,
    current_year_proj_white: number,
    previous_year_black: number,
    current_year_black: number,
    current_year_proj_black: number,
    previous_year_other: number,
    current_year_other: number,
    current_year_proj_other: number
}