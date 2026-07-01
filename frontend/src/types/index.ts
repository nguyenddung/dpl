export interface ITokenResponse { access_token: string; refresh_token: string; token_type: string }
export interface IUser { id: string; email: string; full_name: string; university: string|null; major: string|null; year_of_study: number|null; gpa: number|null; role: string; is_active: boolean; is_verified: boolean; created_at: string }
export interface IPublicUser { id: string; full_name: string; university: string|null; major: string|null; gpa: number|null }
export interface IUserUpdateRequest { full_name?: string; university?: string; major?: string; year_of_study?: number; gpa?: number }
export type LearningStyle = 'visual'|'auditory'|'reading'|'kinesthetic'|'social'|'solitary'
export type AcademicGoal = 'exam_prep'|'certification'|'job_prep'|'research'|'study_abroad'|'startup'
export type TimeSlot = '7-9h'|'9-11h'|'13-15h'|'15-17h'|'19-21h'|'21-23h'
export interface IProfile { id: string; user_id: string; avatar_url: string|null; bio: string|null; learning_style: LearningStyle|null; academic_goal: AcademicGoal|null; availability: string; xp_points: number; streak_days: number; is_public: boolean }
export interface ISubjectInput { subject_id: string; skill_level: string; is_seeking: boolean }
export interface IScheduleSlot { day_of_week: number; time_slot: TimeSlot }
export interface IProfileUpdateRequest { bio?: string; learning_style?: LearningStyle; academic_goal?: AcademicGoal; availability?: string; is_public?: boolean; subjects?: ISubjectInput[]; schedule?: IScheduleSlot[] }
export interface IFactorBreakdown { subject_score: number; schedule_score: number; style_score: number; goal_score: number; gpa_score: number }
export type MatchStatus = 'suggested'|'pending'|'connected'|'rejected'
export interface IMatchResult { user_id: string; full_name: string; university: string|null; major: string|null; gpa: number|null; avatar_url: string|null; tags: string[]; score: number; factors: IFactorBreakdown; status: MatchStatus }
export interface IRecommendationsResponse { total: number; results: IMatchResult[] }
export interface IMatchStatusResponse { match_id: string; status: MatchStatus }
export interface IStudyGroup { id: string; name: string; description: string|null; icon: string|null; owner_id: string; max_members: number; next_session: string|null; is_public: boolean; member_count: number; created_at: string }
export interface IGroupMember { user_id: string; full_name: string; role: string; joined_at: string }
export interface IGroupCreateRequest { name: string; description?: string; icon?: string; max_members?: number; is_public?: boolean }
export interface IMessage { id: string; conversation_id: string; sender_id: string; content: string; message_type: string; is_read: boolean; created_at: string }
export interface IConversation { id: string; other_user_id: string; other_user_name: string; other_user_avatar: string|null; last_message: string|null; unread_count: number; updated_at: string }
export type NotificationType = 'match_request'|'message'|'group_invite'|'group_join'|'achievement'|'system'
export interface INotification { id: string; type: NotificationType; title: string; body: string|null; is_read: boolean }
export interface IApiError { detail: { code: string; message: string } }
