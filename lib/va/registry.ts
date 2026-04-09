import type { EvalProfile } from './types'
import { KNEE_PROFILES, KNEE_CONDITION_PROFILE, getKneeProfile, getKneeProfileKey, calculateKneeRating } from './body-profiles/knee'
import { SPINE_PROFILES, SPINE_CONDITION_PROFILE, getSpineProfile, getSpineProfileKey, calculateSpineRating } from './body-profiles/spine'
import { SHOULDER_PROFILES, SHOULDER_CONDITION_PROFILE, getShoulderProfile, getShoulderProfileKey, calculateShoulderRating } from './body-profiles/shoulder'
import { NECK_PROFILES, NECK_CONDITION_PROFILE, getNeckProfile, getNeckProfileKey, calculateNeckRating } from './body-profiles/neck'
import { HIP_PROFILES, HIP_CONDITION_PROFILE, getHipProfile, getHipProfileKey, calculateHipRating } from './body-profiles/hip'
import { ELBOW_PROFILES, ELBOW_CONDITION_PROFILE, getElbowProfile, getElbowProfileKey, calculateElbowRating } from './body-profiles/elbow'
import { WRIST_PROFILES, WRIST_CONDITION_PROFILE, getWristProfile, getWristProfileKey, calculateWristRating } from './body-profiles/wrist'
import { ANKLE_PROFILES, ANKLE_CONDITION_PROFILE, getAnkleProfile, getAnkleProfileKey, calculateAnkleRating } from './body-profiles/ankle'
import { CHEST_PROFILES, CHEST_CONDITION_PROFILE, getChestProfile, getChestProfileKey, calculateChestRating } from './body-profiles/chest'
import { ABDOMEN_PROFILES, ABDOMEN_CONDITION_PROFILE, getAbdomenProfile, getAbdomenProfileKey, calculateAbdomenRating } from './body-profiles/abdomen'
import { LEG_PROFILES, LEG_CONDITION_PROFILE, getLegProfile, getLegProfileKey, calculateLegRating } from './body-profiles/leg'
import { SYSTEMIC_PROFILES, SYSTEMIC_CONDITION_PROFILE, getSystemicProfile, getSystemicProfileKey, calculateSystemicRating } from './body-profiles/systemic'

export interface BPRegistryEntry {
  id: string
  title: string
  stateKey: string
  panelId: string
  conditions: string
  profiles: () => Record<string, EvalProfile>
  profileMap: () => Record<string, string>
  getProfile: (name: string) => EvalProfile
  getProfileKey: (name: string) => string
  calcRating: (domainValues: Record<string, number>) => number
  sideKeys: Record<string, string>
  extremityMap: Record<string, string>
  note: string
}

export const BP_REGISTRY: Record<string, BPRegistryEntry> = {
  knee: {
    id: 'knee', title: 'Knee Evaluation', stateKey: '_kneeConditions',
    panelId: 'knee-panel', conditions: 'knee',
    profiles: () => KNEE_PROFILES, profileMap: () => KNEE_CONDITION_PROFILE,
    getProfile: getKneeProfile, getProfileKey: getKneeProfileKey,
    calcRating: calculateKneeRating,
    sideKeys: { leftKnee: 'Left', rightKnee: 'Right' },
    extremityMap: { leftKnee: 'LL', rightKnee: 'RL' },
    note: 'Knee conditions can be rated for how far it bends, whether it gives out, and cartilage damage — each rated separately. All contribute to your combined VA rating.',
  },
  back: {
    id: 'back', title: 'Back & Spine Evaluation', stateKey: '_backConditions',
    panelId: 'back-panel', conditions: 'back',
    profiles: () => SPINE_PROFILES, profileMap: () => SPINE_CONDITION_PROFILE,
    getProfile: getSpineProfile, getProfileKey: getSpineProfileKey,
    calcRating: calculateSpineRating,
    sideKeys: { upperBack: 'Upper', spine: 'Mid', lowerBack: 'Lower' },
    extremityMap: {},
    note: 'Back conditions are rated based on how far you can bend and move your spine. Nerve pain that shoots down your legs (radiculopathy/sciatica) is rated as a separate condition.',
  },
  shoulder: {
    id: 'shoulder', title: 'Shoulder Evaluation', stateKey: '_shoulderConditions',
    panelId: 'shoulder-panel', conditions: 'shoulder',
    profiles: () => SHOULDER_PROFILES, profileMap: () => SHOULDER_CONDITION_PROFILE,
    getProfile: getShoulderProfile, getProfileKey: getShoulderProfileKey,
    calcRating: calculateShoulderRating,
    sideKeys: { leftShoulder: 'Left', rightShoulder: 'Right' },
    extremityMap: { leftShoulder: 'LU', rightShoulder: 'RU' },
    note: 'Shoulder conditions are rated on how far you can raise and move your arm, whether it dislocates or slips, and any bone or joint damage.',
  },
  neck: {
    id: 'neck', title: 'Neck Evaluation', stateKey: '_neckConditions',
    panelId: 'neck-panel', conditions: 'neck',
    profiles: () => NECK_PROFILES, profileMap: () => NECK_CONDITION_PROFILE,
    getProfile: getNeckProfile, getProfileKey: getNeckProfileKey,
    calcRating: calculateNeckRating,
    sideKeys: { neck: 'Neck' },
    extremityMap: {},
    note: 'Neck conditions are rated on how far you can turn and tilt your head. Nerve pain, numbness, or tingling that travels down your arms (radiculopathy) is rated as a separate condition.',
  },
  hip: {
    id: 'hip', title: 'Hip Evaluation', stateKey: '_hipConditions',
    panelId: 'hip-panel', conditions: 'hip',
    profiles: () => HIP_PROFILES, profileMap: () => HIP_CONDITION_PROFILE,
    getProfile: getHipProfile, getProfileKey: getHipProfileKey,
    calcRating: calculateHipRating,
    sideKeys: { leftHip: 'Left', rightHip: 'Right' },
    extremityMap: { leftHip: 'LL', rightHip: 'RL' },
    note: 'Hip conditions are rated on how far you can bend, straighten, and spread your leg. The worse your movement limitation, the higher the rating.',
  },
  elbow: {
    id: 'elbow', title: 'Elbow / Forearm Evaluation', stateKey: '_elbowConditions',
    panelId: 'elbow-panel', conditions: 'elbow',
    profiles: () => ELBOW_PROFILES, profileMap: () => ELBOW_CONDITION_PROFILE,
    getProfile: getElbowProfile, getProfileKey: getElbowProfileKey,
    calcRating: calculateElbowRating,
    sideKeys: { leftElbow: 'Left', rightElbow: 'Right', leftForearm: 'Left Forearm', rightForearm: 'Right Forearm' },
    extremityMap: { leftElbow: 'LU', rightElbow: 'RU', leftForearm: 'LU', rightForearm: 'RU' },
    note: 'Elbow and forearm conditions are rated on how far you can bend, straighten, and rotate your arm (like turning a doorknob or screwdriver).',
  },
  wrist_hand: {
    id: 'wrist_hand', title: 'Wrist / Hand Evaluation', stateKey: '_wristConditions',
    panelId: 'wrist-panel', conditions: 'wrist_hand',
    profiles: () => WRIST_PROFILES, profileMap: () => WRIST_CONDITION_PROFILE,
    getProfile: getWristProfile, getProfileKey: getWristProfileKey,
    calcRating: calculateWristRating,
    sideKeys: { leftWrist: 'Left Wrist', rightWrist: 'Right Wrist', leftHand: 'Left Hand', rightHand: 'Right Hand' },
    extremityMap: { leftWrist: 'LU', rightWrist: 'RU', leftHand: 'LU', rightHand: 'RU' },
    note: 'Wrist and hand conditions are rated on how well you can move your wrist, grip strength, nerve problems (like carpal tunnel causing numbness/tingling), and finger function.',
  },
  ankle_foot: {
    id: 'ankle_foot', title: 'Ankle / Foot Evaluation', stateKey: '_ankleConditions',
    panelId: 'ankle-panel', conditions: 'ankle_foot',
    profiles: () => ANKLE_PROFILES, profileMap: () => ANKLE_CONDITION_PROFILE,
    getProfile: getAnkleProfile, getProfileKey: getAnkleProfileKey,
    calcRating: calculateAnkleRating,
    sideKeys: { leftAnkle: 'Left Ankle', rightAnkle: 'Right Ankle', leftFoot: 'Left Foot', rightFoot: 'Right Foot' },
    extremityMap: { leftAnkle: 'LL', rightAnkle: 'RL', leftFoot: 'LL', rightFoot: 'RL' },
    note: 'Ankle and foot conditions are rated on how far you can move your ankle, whether it gives out, flat feet, and heel/arch pain (plantar fasciitis).',
  },
  chest: {
    id: 'chest', title: 'Chest / Lungs Evaluation', stateKey: '_chestConditions',
    panelId: 'chest-panel', conditions: 'chest',
    profiles: () => CHEST_PROFILES, profileMap: () => CHEST_CONDITION_PROFILE,
    getProfile: getChestProfile, getProfileKey: getChestProfileKey,
    calcRating: calculateChestRating,
    sideKeys: { chest: 'Chest', leftLung: 'Left Lung', rightLung: 'Right Lung' },
    extremityMap: {},
    note: 'Breathing conditions are rated on how well your lungs work (based on breathing tests) and whether you need oxygen or inhalers.',
  },
  abdomen: {
    id: 'abdomen', title: 'Abdomen / Pelvis Evaluation', stateKey: '_abdomenConditions',
    panelId: 'abdomen-panel', conditions: 'abdomen',
    profiles: () => ABDOMEN_PROFILES, profileMap: () => ABDOMEN_CONDITION_PROFILE,
    getProfile: getAbdomenProfile, getProfileKey: getAbdomenProfileKey,
    calcRating: calculateAbdomenRating,
    sideKeys: { abdomen: 'Abdomen', pelvis: 'Pelvis' },
    extremityMap: {},
    note: 'Stomach, digestive, bladder, and pelvic conditions are rated on how often symptoms occur, how severe they are, and what treatment you need.',
  },
  leg: {
    id: 'leg', title: 'Thigh / Shin / Calf Evaluation', stateKey: '_legConditions',
    panelId: 'leg-panel', conditions: 'leg',
    profiles: () => LEG_PROFILES, profileMap: () => LEG_CONDITION_PROFILE,
    getProfile: getLegProfile, getProfileKey: getLegProfileKey,
    calcRating: calculateLegRating,
    sideKeys: { leftThigh: 'Left Thigh', rightThigh: 'Right Thigh', leftShin: 'Left Shin', rightShin: 'Right Shin', leftHamstring: 'Left Hamstring', rightHamstring: 'Right Hamstring', leftCalf: 'Left Calf', rightCalf: 'Right Calf' },
    extremityMap: { leftThigh: 'LL', rightThigh: 'RL', leftShin: 'LL', rightShin: 'RL', leftHamstring: 'LL', rightHamstring: 'RL', leftCalf: 'LL', rightCalf: 'RL' },
    note: 'Leg muscle injuries are rated based on how badly the muscle is damaged and how it affects your strength and movement. Nerve damage causing numbness or weakness (neuropathy) is rated as a separate condition.',
  },
  systemic: {
    id: 'systemic', title: 'Other / Systemic Evaluation', stateKey: '_systemicConditions',
    panelId: 'systemic-panel', conditions: 'systemic',
    profiles: () => SYSTEMIC_PROFILES, profileMap: () => SYSTEMIC_CONDITION_PROFILE,
    getProfile: getSystemicProfile, getProfileKey: getSystemicProfileKey,
    calcRating: calculateSystemicRating,
    sideKeys: { systemic: 'Overall' },
    extremityMap: {},
    note: "Whole-body conditions like diabetes, thyroid problems, skin conditions, immune system disorders, and chronic pain are evaluated here. These are conditions that affect your overall health rather than one specific body part.",
  },
}

export const BP_REGISTRY_KEYS = Object.keys(BP_REGISTRY) as (keyof typeof BP_REGISTRY)[]
