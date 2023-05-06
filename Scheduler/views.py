import gzip
from io import BytesIO

from django.db.models import Max
from django.http import QueryDict, HttpResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, DetailView

from .forms import ProcessFormSet, SimulatorForm, SimulatorLogForm
from .models import Process, Simulator, PCore, ECore


def index(request):
    return render(request, 'index.html')


class Index(TemplateView):
    template_name = "index.html"

    def get(self, *args, **kwargs):
        process_formset = ProcessFormSet(queryset=Process.objects.none())
        simulator_form = SimulatorForm()
        simulatorLog = Simulator.objects.all()
        return self.render_to_response({'process_formset': process_formset,
                                        'simulator_form': simulator_form,
                                        'simulatorLog': simulatorLog.values()})

    def post(self, *args, **kwargs):
        requestPost = QueryDict(self.request.POST.get('QueryDict'))

        # 값 파씽 해오는 부분
        algorithm = requestPost.get('Algorithm')
        quantum = requestPost.get('quantum')

        if quantum == '':
            quantum = 0

        # 시뮬레이션 넣기
        name = int(Simulator.objects.count()) + 1
        new_simulator = Simulator(name=name)
        new_simulator.save()
        saved_simulator = Simulator.objects.last()
        saved_simulator.quantum = quantum
        saved_simulator.Algorithm = algorithm
        saved_simulator.save()

        # 값 파씽
        processCnt = int(requestPost.get('processCnt'))
        PCoreCnt = int(requestPost.get('PCoreCnt'))
        ECoreCnt = int(requestPost.get('ECoreCnt'))

        # 코어 저장 하기
        saved_simulator = Simulator.objects.last()
        for i in range(PCoreCnt):
            new_pcore = PCore(Simulator=saved_simulator, powerConsumption=0.0, powerEfficiency=0.0)
            new_pcore.save()
        for i in range(ECoreCnt):
            new_ecore = ECore(Simulator=saved_simulator, powerConsumption=0.0, powerEfficiency=0.0)
            new_ecore.save()

        # 값 파씽 하기
        process_formset = ProcessFormSet(data=requestPost)
        cnt = 0

        # 프로세서 저장 하기
        processes = process_formset.save(commit=False)
        for process in processes:
            cnt += 1
            process.Simulator = saved_simulator
            process.Process = 'Process' + str(cnt)
            process.save()

        return HttpResponse("success")


class ShowLog(DetailView):
    # model = Process
    template_name = 'showLog.html'

    # context_object_name = 'process'
    @csrf_exempt
    def get(self, *args, **kwargs):
        print(self.request.POST)

        processAll = Process.objects.filter(Simulator__name=self.kwargs.get('pk'))
        PCoreAll = PCore.objects.filter(Simulator__name=self.kwargs.get('pk'))
        ECoreAll = ECore.objects.filter(Simulator__name=self.kwargs.get('pk'))
        SimulatorInfo = Simulator.objects.get(name=self.kwargs.get('pk'))
        simulatorLog = Simulator.objects.all()

        return self.render_to_response({'processAll': processAll,
                                        'PCoreAll': PCoreAll,
                                        'ECoreAll': ECoreAll,
                                        'SimulatorInfo': SimulatorInfo,
                                        'simulatorLog': simulatorLog.values()})
