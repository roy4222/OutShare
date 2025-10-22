/**
 * Prisma Services - 統一導出
 * 
 * 使用方式：
 * ```typescript
 * import { getTripList, getEquipmentList, getProfileByUserId } from '@/lib/services/prisma'
 * 
 * // 或個別導入
 * import * as tripsService from '@/lib/services/prisma/trips.service'
 * import * as equipmentService from '@/lib/services/prisma/equipment.service'
 * import * as profilesService from '@/lib/services/prisma/profiles.service'
 * ```
 */

// Trips Service
export {
  getTripList,
  getTripById,
  getTripUuidBySlug,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripWithEquipment,
} from './trips.service';

// Equipment Service
export {
  getEquipmentList,
  getEquipmentById,
  getEquipmentByTrip,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  addEquipmentToTrip,
  removeEquipmentFromTrip,
} from './equipment.service';

// Profiles Service
export {
  getProfileByUserId,
  getProfileByUsername,
  createProfile,
  updateProfile,
  isUsernameAvailable,
  getProfileWithStats,
  type ProfileData,
} from './profiles.service';

