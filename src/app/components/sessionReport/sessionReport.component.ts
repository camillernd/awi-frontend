import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-session-report',
    templateUrl: './sessionReport.component.html',
    styleUrls: ['./sessionReport.component.css'],
    standalone: true, // Indique que ce composant est autonome
    imports: [CommonModule, NavbarComponent], // Inclure NavbarComponent ici
})
export class SessionReportComponent implements OnInit {
    sessionId!: string;
    report: any;

    constructor(private sessionService: SessionService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.sessionId = this.route.snapshot.paramMap.get('sessionId')!;
        this.loadReport();
    }

    loadReport(): void {
        this.sessionService.getSessionReport(this.sessionId).subscribe({
            next: (data) => {
                this.report = data;
            },
            error: (err) => console.error('Erreur lors de la récupération du rapport :', err),
        });
    }
}
