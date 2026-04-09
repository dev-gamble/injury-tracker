export const SIDEBAR_ITEMS: Record<string, string> = {
  mental: 'Mental Health',
  headFace: 'Head & Face',
  neck: 'Neck',
  shoulder: 'Shoulders',
  chest: 'Chest / Lungs',
  elbow: 'Elbow / Forearm',
  wrist_hand: 'Wrist / Hand',
  abdomen: 'Abdomen / Pelvis',
  hip: 'Hips',
  knee: 'Knees',
  leg: 'Thigh / Shin / Calf',
  ankle_foot: 'Ankle / Foot',
  back: 'Back & Spine',
  systemic: 'Other / Systemic',
}

// [group label, [region ids]]
export const GROUPS_FRONT: [string, string[]][] = [
  ['Mental Health', ['mental']],
  ['Head & Face', ['headFace']],
  ['Neck / Shoulders', ['neck', 'shoulder']],
  ['Chest / Lungs', ['chest']],
  ['Arms', ['elbow', 'wrist_hand']],
  ['Abdomen / Pelvis', ['abdomen']],
  ['Hips', ['hip']],
  ['Legs', ['knee', 'leg', 'ankle_foot']],
  ['Other / Systemic', ['systemic']],
]

export const GROUPS_BACK: [string, string[]][] = [
  ['Mental Health', ['mental']],
  ['Head & Face', ['headFace']],
  ['Neck / Shoulders', ['neck', 'shoulder']],
  ['Back & Spine', ['back']],
  ['Arms', ['elbow', 'wrist_hand']],
  ['Lower Body', ['hip', 'knee', 'leg', 'ankle_foot']],
  ['Other / Systemic', ['systemic']],
]
