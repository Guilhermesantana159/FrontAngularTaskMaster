import { FeedbackDataDashboard } from "../Projeto/ProjetoDashboard"
import { RetornoPadrao } from "../RetornoPadrao"

export interface FeedbackResponse extends RetornoPadrao{ 
    data: FeedbackDataDashboard
}

