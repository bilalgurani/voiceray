import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule]
})
export class AppComponent {
  title = 'Voiceray';

  cardData = [
    {
      "tags": [
        "students",
        "education"
      ],
      "speaker": "Moulana Ahmed Siraj",
      "topic": "Role of students in campuses",
      "duration": "12:45",
      "uploadeTime": "27-07-2025"
    },
    {
      "tags": [
        "deen",
        "youth"
      ],
      "speaker": "Dr. Ismail",
      "topic": "Why Youth Must Uphold Deen",
      "duration": "10:30",
      "uploadeTime": "26-07-2025"
    },
    {
      "tags": [
        "society",
        "islam"
      ],
      "speaker": "Moulana Salman Nadwi",
      "topic": "Reforming Society through Islam",
      "duration": "15:20",
      "uploadeTime": "25-07-2025"
    },
    {
      "tags": [
        "motivation",
        "students"
      ],
      "speaker": "Brother Imran",
      "topic": "Power of Consistency",
      "duration": "09:10",
      "uploadeTime": "24-07-2025"
    },
    {
      "tags": [
        "education",
        "deen"
      ],
      "speaker": "Moulana Mufti Muneeb",
      "topic": "Balancing Deen and Dunya",
      "duration": "11:05",
      "uploadeTime": "23-07-2025"
    },
    {
      "tags": [
        "campus",
        "leadership"
      ],
      "speaker": "Ustadh Faheem",
      "topic": "Building Leadership in Campuses",
      "duration": "13:30",
      "uploadeTime": "22-07-2025"
    },
    {
      "tags": [
        "quran",
        "guidance"
      ],
      "speaker": "Sheikh Asif",
      "topic": "Quran as a Source of Guidance",
      "duration": "17:00",
      "uploadeTime": "21-07-2025"
    },
    {
      "tags": [
        "productivity",
        "students"
      ],
      "speaker": "Dr. Farhan Khan",
      "topic": "Time Management for Students",
      "duration": "08:45",
      "uploadeTime": "20-07-2025"
    },
    {
      "tags": [
        "unity",
        "ummah"
      ],
      "speaker": "Moulana Rizwan",
      "topic": "Unity of the Muslim Ummah",
      "duration": "14:15",
      "uploadeTime": "19-07-2025"
    },
    {
      "tags": [
        "youth",
        "identity"
      ],
      "speaker": "Ustadh Zaid Patel",
      "topic": "Islamic Identity in a Modern World",
      "duration": "16:10",
      "uploadeTime": "18-07-2025"
    },
    {
      "tags": [
        "career",
        "guidance"
      ],
      "speaker": "Dr. Areeb Siddiqui",
      "topic": "Career Planning with Islamic Values",
      "duration": "11:20",
      "uploadeTime": "17-07-2025"
    },
    {
      "tags": [
        "jihad",
        "misconceptions"
      ],
      "speaker": "Moulana Tanveer",
      "topic": "Clearing Misconceptions about Jihad",
      "duration": "19:30",
      "uploadeTime": "16-07-2025"
    },
    {
      "tags": [
        "islamophobia",
        "activism"
      ],
      "speaker": "Sister Sumaiya",
      "topic": "Dealing with Islamophobia on Campus",
      "duration": "10:00",
      "uploadeTime": "15-07-2025"
    },
    {
      "tags": [
        "parents",
        "respect"
      ],
      "speaker": "Mufti Umar",
      "topic": "Rights of Parents in Islam",
      "duration": "18:25",
      "uploadeTime": "14-07-2025"
    },
    {
      "tags": [
        "akhlaq",
        "character"
      ],
      "speaker": "Ustadh Saeed",
      "topic": "Character Building for Success",
      "duration": "07:55",
      "uploadeTime": "13-07-2025"
    }
  ]

}
