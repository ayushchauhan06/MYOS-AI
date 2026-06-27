export interface GenerateProposalInput {
  companyName: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  requirements: string;
  emailTone?: string;
  proposalStyle?: string;
}

export interface GenerateProposalOutput {
  title: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export interface LeadAnalysisOutput {
  painPoints: string[];
  outreachAngle: string;
  estimatedValue?: string;
  leadScore: number;
  aiConfidence: number;
  icebreaker?: string;
}

export interface AIProvider {
  generateProposal(
    input: GenerateProposalInput,
    apiKey?: string,
    model?: string,
    temperature?: number
  ): Promise<GenerateProposalOutput>;
  
  analyzeLead(
    companyName: string,
    websiteUrl?: string,
    industry?: string,
    apiKey?: string,
    model?: string
  ): Promise<LeadAnalysisOutput>;
}
