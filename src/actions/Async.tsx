export const Start = 'start'
export const Finish = 'finish'
export const Success = 'success'
export const Failure = 'failure'
export const Always = 'always'

export type AsyncStatus =
    typeof Start |
    typeof Finish |
    typeof Success |
    typeof Failure |
    typeof Always