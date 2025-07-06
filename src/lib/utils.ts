import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cookie management utilities
export interface QuestParticipation {
  questId: string;
  questContractAddress: string;
  messageHash: string | null;
  verifyProof: string | null;
  transactionHash: string;
  joinedAt: string;
}

export interface QuestSubmission {
  questId: string;
  questContractAddress: string;
  proofUrl: string;
  messageHash: string | null;
  transactionHash: string;
  submittedAt: string;
}

export function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

export function saveQuestParticipation(participation: QuestParticipation) {
  try {
    // Get existing participations
    const existingParticipations = getQuestParticipations();
    
    // Check if user already participated in this specific quest (using both ID and contract address)
    const existingIndex = existingParticipations.findIndex(
      p => p.questId === participation.questId && p.questContractAddress === participation.questContractAddress
    );
    
    let updatedParticipations: QuestParticipation[];
    
    if (existingIndex !== -1) {
      // Update existing participation
      updatedParticipations = [...existingParticipations];
      updatedParticipations[existingIndex] = participation;
    } else {
      // Add new participation
      updatedParticipations = [...existingParticipations, participation];
    }
    
    // Save to cookie
    setCookie('questParticipations', JSON.stringify(updatedParticipations));
    
    return true;
  } catch (error) {
    console.error('Error saving quest participation:', error);
    return false;
  }
}

export function getQuestParticipations(): QuestParticipation[] {
  try {
    const participationsCookie = getCookie('questParticipations');
    if (!participationsCookie) return [];
    
    return JSON.parse(participationsCookie);
  } catch (error) {
    console.error('Error parsing quest participations:', error);
    return [];
  }
}

export function hasUserParticipatedInQuest(questId: string, contractAddress: string): boolean {
  const participations = getQuestParticipations();
  return participations.some(p => p.questId === questId && p.questContractAddress === contractAddress);
}

export function removeQuestParticipation(questId: string, contractAddress: string) {
  try {
    const existingParticipations = getQuestParticipations();
    const updatedParticipations = existingParticipations.filter(
      p => !(p.questId === questId && p.questContractAddress === contractAddress)
    );
    
    setCookie('questParticipations', JSON.stringify(updatedParticipations));
    return true;
  } catch (error) {
    console.error('Error removing quest participation:', error);
    return false;
  }
}

export function clearAllQuestParticipations() {
  try {
    setCookie('questParticipations', '[]');
    return true;
  } catch (error) {
    console.error('Error clearing quest participations:', error);
    return false;
  }
}

// Quest submission tracking functions
export function saveQuestSubmission(submission: QuestSubmission) {
  try {
    // Get existing submissions
    const existingSubmissions = getQuestSubmissions();
    
    // Check if user already submitted for this specific quest (using both ID and contract address)
    const existingIndex = existingSubmissions.findIndex(
      s => s.questId === submission.questId && s.questContractAddress === submission.questContractAddress
    );
    
    let updatedSubmissions: QuestSubmission[];
    
    if (existingIndex !== -1) {
      // Update existing submission
      updatedSubmissions = [...existingSubmissions];
      updatedSubmissions[existingIndex] = submission;
    } else {
      // Add new submission
      updatedSubmissions = [...existingSubmissions, submission];
    }
    
    // Save to cookie
    setCookie('questSubmissions', JSON.stringify(updatedSubmissions));
    
    return true;
  } catch (error) {
    console.error('Error saving quest submission:', error);
    return false;
  }
}

export function getQuestSubmissions(): QuestSubmission[] {
  try {
    const submissionsCookie = getCookie('questSubmissions');
    if (!submissionsCookie) return [];
    
    return JSON.parse(submissionsCookie);
  } catch (error) {
    console.error('Error parsing quest submissions:', error);
    return [];
  }
}

export function hasUserSubmittedProofForQuest(questId: string, contractAddress: string): boolean {
  const submissions = getQuestSubmissions();
  return submissions.some(s => s.questId === questId && s.questContractAddress === contractAddress);
}

export function removeQuestSubmission(questId: string, contractAddress: string) {
  try {
    const existingSubmissions = getQuestSubmissions();
    const updatedSubmissions = existingSubmissions.filter(
      s => !(s.questId === questId && s.questContractAddress === contractAddress)
    );
    
    setCookie('questSubmissions', JSON.stringify(updatedSubmissions));
    return true;
  } catch (error) {
    console.error('Error removing quest submission:', error);
    return false;
  }
}

export function clearAllQuestSubmissions() {
  try {
    setCookie('questSubmissions', '[]');
    return true;
  } catch (error) {
    console.error('Error clearing quest submissions:', error);
    return false;
  }
}
