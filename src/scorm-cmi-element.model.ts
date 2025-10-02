export type ReadWriteScormCmiElementTypeMap = [
  {element: `cmi.comments_from_learner.${number}.comment`; value: string}, // (localized_string_type (SPM:4000), RW) Textual input
  {element: `cmi.comments_from_learner.${number}.location`; value: string}, // (string (SPM:250), RW) Point in the SCO to which the comment applies
  {element: `cmi.comments_from_learner.${number}.timestamp`; value: unknown}, // (time (second,10,0), RW) Point in time at which the comment was created or most recently changed
  {element: `cmi.completion_status`; value: 'completed' | 'incomplete' | 'not attempted' | 'unknown'}, //  ("completed", "incomplete", "not attempted", "unknown", RW) Indicates whether the learner has completed the SCO
  {element: `cmi.interactions.${number}.id`; value: string}, // (long_identifier_type (SPM:4000), RW) Unique label for the interaction
  {element: `cmi.interactions.${number}.objectives.${number}.id`; value: string}, // (long_identifier_type (SPM:4000), RW) Label for objectives associated with the interaction
  {element: `cmi.interactions.${number}.timestamp`; value: unknown}, // (time(second,10,0), RW) Point in time at which the interaction was first made available to the learner for learner interaction and response
  {element: `cmi.interactions.${number}.correct_responses.${number}.pattern`; value: unknown}, // (format depends on interaction type, RW) One correct response pattern for the interaction
  {element: `cmi.interactions.${number}.weighting`; value: Float}, // (real (10,7), RW) Weight given to the interaction relative to other interactions
  {element: `cmi.interactions.${number}.learner_response`; value: unknown}, // (format depends on interaction type, RW) Data generated when a learner responds to an interaction
  {element: `cmi.interactions.${number}.latency`; value: unknown}, // (timeinterval (second,10,2), RW) Time elapsed between the time the interaction was made available to the learner for response and the time of the first response
  {element: `cmi.interactions.${number}.description`; value: string}, // (localized_string_type (SPM:250), RW) Brief informative description of the interaction
  {element: `cmi.learner_preference.audio_level`; value: Float}, // (real(10,7), range (0..*), RW) Specifies an intended change in perceived audio level
  {element: `cmi.learner_preference.language`; value: string}, // (language_type (SPM 250), RW) The learner’s preferred language for SCOs with multilingual capability
  {element: `cmi.learner_preference.delivery_speed`; value: Float}, // (real(10,7), range (0..*), RW) The learner’s preferred relative speed of content delivery
  {element: `cmi.learner_preference.audio_captioning`; value: '-1' | '0' | '1'}, // ("-1", "0", "1", RW) Specifies whether captioning text corresponding to audio is displayed
  {element: `cmi.location`; value: string}, // (string (SPM:1000), RW) The learner’s current location in the SCO
  {element: `cmi.objectives.${number}.id`; value: string}, // (long_identifier_type (SPM:4000), RW) Unique label for the objective
  {element: `cmi.objectives.${number}.score.scaled`; value: Float}, // (real (10,7) range (-1..1), RW) Number that reflects the performance of the learner for the objective
  {element: `cmi.objectives.${number}.score.raw`; value: Float}, // (real (10,7), RW) Number that reflects the performance of the learner, for the objective, relative to the range bounded by the values of min and max
  {element: `cmi.objectives.${number}.score.min`; value: Float}, // (real (10,7), RW) Minimum value, for the objective, in the range for the raw score
  {element: `cmi.objectives.${number}.score.max`; value: Float}, // (real (10,7), RW) Maximum value, for the objective, in the range for the raw score
  {element: `cmi.objectives.${number}.success_status`; value: 'passed' | 'failed' | 'unknown'}, // ("passed", "failed", "unknown", RW) Indicates whether the learner has mastered the objective
  {
    element: `cmi.objectives.${number}.completion_status`;
    value: 'completed' | 'incomplete' | 'not attempted' | 'unknown';
  }, // ("completed", "incomplete", "not attempted", "unknown", RW) Indicates whether the learner has completed the associated objective
  {element: `cmi.objectives.${number}.progress_measure`; value: Float}, // (real (10,7) range (0..1), RW) Measure of the progress the learner has made toward completing the objective
  {element: `cmi.objectives.${number}.description`; value: string}, // (localized_string_type (SPM:250), RW) Provides a brief informative description of the objective
  {element: `cmi.progress_measure`; value: Float}, // (real (10,7) range (0..1), RW) Measure of the progress the learner has made toward completing the SCO
  {element: `cmi.score.scaled`; value: Float}, // (real (10,7) range (-1..1), RW) Number that reflects the performance of the learner
  {element: `cmi.score.raw`; value: Float}, // (real (10,7), RW) Number that reflects the performance of the learner relative to the range bounded by the values of min and max
  {element: `cmi.score.min`; value: Float}, // (real (10,7), RW) Minimum value in the range for the raw score
  {element: `cmi.score.max`; value: Float}, // (real (10,7), RW) Maximum value in the range for the raw score
  {element: `cmi.success_status`; value: 'passed' | 'failed' | 'unknown'}, // ("passed", "failed", "unknown", RW) Indicates whether the learner has mastered the SCO
  {element: `cmi.suspend_data`; value: string}, // (string (SPM:64000), RW) Provides space to store and retrieve data between learner sessions
  {element: `adl.nav.request`; value: unknown}, // (request(continue, previous, choice, jump, exit, exitAll, abandon, abandonAll, suspendAll _none_), RW) Navigation request to be processed immediately following Terminate()
  {
    element: `cmi.interactions.${number}.type`;
    value:
      | 'true-false'
      | 'choice'
      | 'fill-in'
      | 'long-fill-in'
      | 'matching'
      | 'performance'
      | 'sequencing'
      | 'likert'
      | 'numeric'
      | 'other';
  }, // ("true-false", "choice", "fill-in", "long-fill-in", "matching", "performance", "sequencing", "likert", "numeric" or "other", RW) Which type of interaction is recorded
  {
    element: `cmi.interactions.${number}.result`;
    value: 'correct' | 'incorrect' | 'unanticipated' | 'neutral';
  }, // ("correct", "incorrect", "unanticipated", "neutral") or a real number with values that is accurate to seven significant decimal figures real. , RW) Judgment of the correctness of the learner response
];

export type ReadScormCmiElementTypeMap =
  | ReadWriteScormCmiElementTypeMap
  | [
      {element: `cmi._version`; value: string}, // (string, RO) Represents the version of the data model
      {element: `cmi.comments_from_learner._children`; value: unknown}, // (comment,location,timestamp, RO) Listing of supported data model elements
      {element: `cmi.comments_from_learner._count`; value: PositiveInteger}, // (non-negative integer, RO) Current number of learner comments
      {element: `cmi.comments_from_lms._children`; value: unknown}, // (comment,location,timestamp, RO) Listing of supported data model elements
      {element: `cmi.comments_from_lms._count`; value: PositiveInteger}, // (non-negative integer, RO) Current number of comments from the LMS
      {element: `cmi.comments_from_lms.${number}.comment`; value: string}, // (localized_string_type (SPM:4000), RO) Comments or annotations associated with a SCO
      {element: `cmi.comments_from_lms.${number}.location`; value: string}, // (string (SPM:250), RO) Point in the SCO to which the comment applies
      {element: `cmi.comments_from_lms.${number}.timestamp`; value: unknown}, // (time(second,10,0), RO) Point in time at which the comment was created or most recently changed
      {element: `cmi.completion_threshold`; value: Float}, // (real(10,7) range (0..1), RO) Used to determine whether the SCO should be considered complete
      {element: `cmi.credit`; value: 'credit' | 'no-credit'}, // ("credit", "no-credit", RO) Indicates whether the learner will be credited for performance in the SCO
      {element: `cmi.entry`; value: unknown}, // (ab_initio, resume, "", RO) Asserts whether the learner has previously accessed the SCO
      {element: `cmi.interactions._children`; value: unknown}, // (id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description, RO) Listing of supported data model elements
      {element: `cmi.interactions._count`; value: PositiveInteger}, // (non-negative integer, RO) Current number of interactions being stored by the LMS
      {element: `cmi.interactions.${number}.objectives._count`; value: PositiveInteger}, // (non-negative integer, RO) Current number of objectives (i.e., objective identifiers) being stored by the LMS for this interaction
      {element: `cmi.interactions.${number}.correct_responses._count`; value: PositiveInteger}, // (non-negative integer, RO) Current number of correct responses being stored by the LMS for this interaction
      {element: `cmi.launch_data`; value: string}, // (string (SPM:4000), RO) Data provided to a SCO after launch, initialized from the dataFromLMS manifest element
      {element: `cmi.learner_id`; value: string}, // (long_identifier_type (SPM:4000), RO) Identifies the learner on behalf of whom the SCO was launched
      {element: `cmi.learner_name`; value: string}, // (localized_string_type (SPM:250), RO) Name provided for the learner by the LMS
      {element: `cmi.learner_preference._children`; value: unknown}, // (audio_level,language,delivery_speed,audio_captioning, RO) Listing of supported data model elements
      {element: `cmi.max_time_allowed`; value: unknown}, // (timeinterval (second,10,2), RO) Amount of accumulated time the learner is allowed to use a SCO
      {element: `cmi.mode`; value: 'browse' | 'normal' | 'review'}, // ("browse", "normal", "review", RO) Identifies one of three possible modes in which the SCO may be presented to the learner
      {element: `cmi.objectives._children`; value: unknown}, // (id,score,success_status,completion_status,description, RO) Listing of supported data model elements
      {element: `cmi.objectives._count`; value: PositiveInteger}, // (non-negative integer, RO) Current number of objectives being stored by the LMS
      {element: `cmi.objectives.${number}.score._children`; value: unknown}, // (scaled,raw,min,max, RO) Listing of supported data model elements
      {element: `cmi.scaled_passing_score`; value: Float}, // (real(10,7) range (-1 .. 1), RO) Scaled passing score required to master the SCO
      {element: `cmi.score._children`; value: unknown}, // (scaled,raw,min,max, RO) Listing of supported data model elements
      {
        element: `cmi.time_limit_action`;
        value: 'exit,message' | 'continue|message' | 'exit|no message' | 'continue,no message';
      }, // ("exit,message", "continue,message", "exit,no message", "continue,no message", RO) Indicates what the SCO should do when cmi.max_time_allowed is exceeded
      {element: `cmi.total_time`; value: unknown}, // (timeinterval (second,10,2), RO) Sum of all of the learner’s session times accumulated in the current learner attempt
      {element: `adl.nav.request_valid.continue`; value: boolean | unknown}, // (state (true, false, unknown), RO) Used by a SCO to determine if a Continue navigation request will succeed.
      {element: `adl.nav.request_valid.previous`; value: boolean | unknown}, // (state (true, false, unknown), RO) Used by a SCO to determine if a Previous navigation request will succeed.
      {element: `adl.nav.request_valid.choice.{target=}`; value: boolean | unknown}, // (state (true, false, unknown), RO) Used by a SCO to determine if a Choice navigation request for the target activity will succeed.
      {element: `adl.nav.request_valid.jump.{target=}`; value: boolean | unknown}, // (state (true, false, unknown), RO) Used by a SCO to determine if a Jump navigation request for the target activity will succeed.
    ];

export type WriteScormCmiElementTypeMap =
  | ReadWriteScormCmiElementTypeMap
  | [
      {element: `cmi.session_time`; value: unknown}, // (timeinterval (second,10,2), WO) Amount of time that the learner has spent in the current learner session for this SCO
      {element: `cmi.exit`; value: unknown}, // (timeout, suspend, logout, normal, "", WO) Indicates how or why the learner left the SCO
    ];

export type CmiReadKeyValuePair = ReadScormCmiElementTypeMap[number];
export type CmiReadKeyToValueMap = {
  [P in CmiReadKeyValuePair as P['element']]: P['value'];
};

export type CmiWriteKeyValuePair = WriteScormCmiElementTypeMap[number];
export type CmiWriteKeyToValueMap = {
  [P in CmiWriteKeyValuePair as P['element']]: P['value'];
};

export type PositiveInteger = number & {};
export type Float = number & {};

export type Scorm2004Api = {
  Initialize: (param: string) => string | boolean;
  Terminate: (param: string) => string | boolean;
  GetValue: (element: string) => string;
  SetValue: (element: string, value: unknown) => string | boolean;
  Commit: (param: string) => string | boolean;
  GetLastError: () => string | number;
  GetErrorString: (errorCode: string | number) => string;
  GetDiagnostic: (errorCode: string | number) => string;
};
