"use client";

import { useApp, AnimalType, Animal } from "@/context/AppContext";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { useState } from "react";
import { Plus, FileDown, Syringe, Bug, Trash2, X, Check, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ANIMAL_TYPES: AnimalType[] = ['Vaca', 'Toro', 'Novillo', 'Ternera', 'Vaquillona', 'Ternero'];

export default function Dashboard() {
    const { animals, addAnimal, removeAnimal, toggleAttribute, updateCaravana, clearAll } = useApp();
    const [selectedType, setSelectedType] = useState<AnimalType | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAll = () => {
        clearAll();
        setShowDeleteConfirm(false);
    };

    const getCount = (type: AnimalType) => animals.filter(a => a.type === type).length;
    const getByType = (type: AnimalType) => animals.filter(a => a.type === type);

    const totalAnimals = animals.length;

    const generatePDFDoc = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text("Reporte de Existencias Ganaderas", 14, 20);

        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 26);

        // Summary Table
        const summaryData = ANIMAL_TYPES.map(type => {
            const typeAnimals = getByType(type);
            const vaccinated = typeAnimals.filter(a => a.vaccination).length;
            const antiparasitic = typeAnimals.filter(a => a.antiparasitic).length;
            return [type, typeAnimals.length, vaccinated, antiparasitic];
        });

        autoTable(doc, {
            head: [['Categoría', 'Cantidad', 'Vacunados', 'Antiparasitario']],
            body: summaryData,
            startY: 32,
            theme: 'grid',
            headStyles: { fillColor: [132, 204, 22] },
            styles: { fontSize: 9, cellPadding: 1 } // Compact table
        });

        // Current Y position after table
        // @ts-ignore
        let currentY = (doc as any).lastAutoTable.finalY + 5;

        // Generate Pie Chart
        const canvas = document.createElement('canvas');
        canvas.width = 400; // Smaller chart
        canvas.height = 250;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            const chartData = ANIMAL_TYPES.map(type => getCount(type));
            const chartColors = ['#84cc16', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

            const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ANIMAL_TYPES.map((type, i) => `${type} (${chartData[i]})`),
                    datasets: [{ data: chartData, backgroundColor: chartColors }]
                },
                options: {
                    animation: false,
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: { size: 11 },
                                boxWidth: 10
                            }
                        }
                    }
                }
            });

            const chartImage = chart.toBase64Image();

            // Check if chart fits, otherwise new page
            if (currentY + 70 > 280) {
                doc.addPage();
                currentY = 20;
            }

            doc.text("Distribución", 14, currentY + 5);
            doc.addImage(chartImage, 'PNG', 15, currentY + 8, 140, 70); // Smaller image
            currentY += 85;

            chart.destroy();
        }

        // Total
        if (currentY + 20 > 280) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(22, 101, 52);
        doc.text(`Total General: ${totalAnimals} Animales`, 14, currentY);
        doc.setTextColor(0);
        currentY += 10;

        // Detailed list
        doc.setFontSize(12);
        doc.text("Detalle Individual", 14, currentY + 5);

        const detailedData = animals.map((a, index) => [
            index + 1,
            a.type,
            a.caravana || '-',
            a.vaccination ? 'Si' : 'No',
            a.antiparasitic ? 'Si' : 'No'
        ]);

        autoTable(doc, {
            head: [['#', 'Categoría', 'Caravana', 'Vac.', 'Anti.']],
            body: detailedData,
            startY: currentY + 10,
            styles: { fontSize: 8 },
            pageBreak: 'auto'
        });

        return doc;
    };

    const handleDownloadPDF = () => {
        const doc = generatePDFDoc();
        doc.save("reporte_ganadero.pdf");
    };

    const handleSharePDF = async () => {
        const doc = generatePDFDoc();
        const pdfBlob = doc.output('blob');
        const file = new File([pdfBlob], "reporte_ganadero.pdf", { type: "application/pdf" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Reporte Ganadero',
                    text: 'Te comparto el reporte de existencias ganaderas.',
                    files: [file]
                });
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.log('Error sharing:', error);
                }
            }
        } else {
            // Fallback for browsers that don't support sharing files (mostly desktops)
            alert('La función "Compartir" está optimizada para celulares/tablets. En este dispositivo se descargará el archivo automáticamente.');
            doc.save("reporte_ganadero.pdf");
        }
    };


    return (
        <div className="min-h-screen p-6 pb-20">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-emerald-400 text-shadow">
                        Contador de Campo
                    </h1>
                    <p className="text-[var(--muted-foreground)]">Gestiona tu ganado de forma eficiente</p>
                </div>
            </header>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {ANIMAL_TYPES.map((type, index) => (
                    <Card key={type} delay={index * 0.1} className="hover:border-[var(--primary)] transition-colors cursor-pointer group" >
                        <div onClick={() => setSelectedType(type)} className="h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold">{type}</h3>
                                <div className="p-2 bg-[var(--primary)]/10 rounded-full text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors">
                                    <Plus className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-4xl font-bold text-[var(--foreground)]">{getCount(type)}</span>
                                    <span className="text-[var(--muted-foreground)] ml-2">animales</span>
                                </div>
                            </div>

                            {/* Mini stats */}
                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-[var(--muted-foreground)]">
                                <div>Vac: {getByType(type).filter(a => a.vaccination).length}</div>
                                <div>Anti: {getByType(type).filter(a => a.antiparasitic).length}</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Delete Button - Positioned right below cards */}
            <div className="flex justify-end mb-10 mr-2">
                <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="danger"
                    size="lg"
                    className="rounded-full shadow-lg flex items-center gap-2"
                >
                    <Trash2 className="w-5 h-5" />
                    Borrar Todo
                </Button>
            </div>

            {/* Floating Action Button for Export */}
            <motion.div
                className="fixed bottom-8 right-8 flex flex-col gap-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <div className="flex flex-col gap-3 items-end">
                    <Button
                        onClick={handleSharePDF}
                        size="lg"
                        className="rounded-full shadow-xl flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        title="Compartir en Drive, WhatsApp, etc."
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden md:inline">Compartir / Drive</span>
                        <span className="md:hidden">Compartir</span>
                    </Button>
                    <Button onClick={handleDownloadPDF} size="lg" className="rounded-full shadow-2xl flex items-center gap-2">
                        <FileDown className="w-5 h-5" />
                        Exportar PDF
                    </Button>
                </div>
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedType && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedType(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="relative bg-[var(--card)] w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-[var(--card-border)]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-[var(--card-border)] flex justify-between items-center bg-[var(--muted)]/30">
                                <h2 className="text-2xl font-bold text-[var(--primary)]">{selectedType}</h2>
                                <div>
                                    <Button onClick={() => setSelectedType(null)} variant="ghost" size="sm">
                                        <X className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 pb-28">
                                {getByType(selectedType).length === 0 ? (
                                    <div className="text-center text-[var(--muted-foreground)] py-10">
                                        No hay animales registrados en esta categoría.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {/* Header - Hidden on mobile */}
                                        <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-[var(--muted-foreground)] mb-2 px-4">
                                            <div className="col-span-1">#</div>
                                            <div className="col-span-5">Caravana</div>
                                            <div className="col-span-2 text-center">Vacuna</div>
                                            <div className="col-span-2 text-center">Antiparasitario</div>
                                            <div className="col-span-2 text-end">Acción</div>
                                        </div>

                                        {getByType(selectedType).map((animal, idx) => (
                                            <motion.div
                                                key={animal.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="grid grid-cols-5 md:grid-cols-12 gap-2 md:gap-4 items-center bg-[var(--muted)]/20 px-4 py-3 rounded-lg border border-transparent hover:border-[var(--card-border)] transition-colors"
                                            >
                                                <div className="hidden md:block col-span-1 text-[var(--muted-foreground)]">{idx + 1}</div>
                                                <div className="col-span-2 md:col-span-5">
                                                    <input
                                                        type="text"
                                                        value={animal.caravana || ''}
                                                        onChange={(e) => updateCaravana(animal.id, e.target.value)}
                                                        placeholder="-"
                                                        className="bg-transparent border border-[var(--muted-foreground)]/20 rounded px-2 py-1 w-full text-sm focus:border-[var(--primary)]/50 focus:outline-none"
                                                    />
                                                </div>

                                                <div className="col-span-1 md:col-span-2 flex justify-center">
                                                    <label className="cursor-pointer flex items-center justify-center w-8 h-8 rounded bg-[var(--card)] border border-[var(--card-border)] has-[:checked]:bg-[var(--primary)] has-[:checked]:text-[var(--primary-foreground)] transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={animal.vaccination}
                                                            onChange={() => toggleAttribute(animal.id, 'vaccination')}
                                                        />
                                                        <Syringe className="w-4 h-4" />
                                                    </label>
                                                </div>

                                                <div className="col-span-1 md:col-span-2 flex justify-center">
                                                    <label className="cursor-pointer flex items-center justify-center w-8 h-8 rounded bg-[var(--card)] border border-[var(--card-border)] has-[:checked]:bg-blue-500 has-[:checked]:text-white transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={animal.antiparasitic}
                                                            onChange={() => toggleAttribute(animal.id, 'antiparasitic')}
                                                        />
                                                        <Bug className="w-4 h-4" />
                                                    </label>
                                                </div>

                                                <div className="col-span-1 md:col-span-2 flex justify-end">
                                                    <button
                                                        onClick={() => removeAnimal(animal.id)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-6 right-6 z-10 flex gap-4">
                                <Button
                                    onClick={() => setSelectedType(null)}
                                    size="lg"
                                    className="rounded-full shadow-xl flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                                >
                                    <Check className="w-5 h-5" /> Finalizar
                                </Button>
                                <Button
                                    onClick={() => addAnimal(selectedType)}
                                    size="lg"
                                    className="rounded-full shadow-xl flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)]"
                                >
                                    <Plus className="w-5 h-5" /> Agregar Individual
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--card)] p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-[var(--card-border)] text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4 text-red-500">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">¿Borrar todos los registros?</h3>
                            <p className="text-[var(--muted-foreground)] mb-6">
                                Esta acción no se puede deshacer. Se eliminarán todos los animales contados.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary">
                                    Cancelar
                                </Button>
                                <Button onClick={handleDeleteAll} variant="danger">
                                    Sí, borrar
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
