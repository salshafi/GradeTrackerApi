namespace GradeTrackerApi.Models {
    public class Grade {


        public int Id { get; set; }
        public string CourseName { get; set; } = string.Empty;
        public string AssignmentName { get; set; } = string.Empty;
        public double Score { get; set; }
        public double MaxScore { get; set; }
        public DateTime DateRecorded { get; set; }
    
    }

}
