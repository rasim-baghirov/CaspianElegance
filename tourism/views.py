from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from .models import CarouselItem, Attraction, AttractionTab, Tab, Tour, Favourite, TourBadge

def index(request):
    carousel_items = CarouselItem.objects.all()
    tabs = Tab.objects.prefetch_related(
        'attractions',
        'attractions__attractiontab_set'
    ).all()
    tours = Tour.objects.filter(is_active=True)

    favourite_tour_ids = []
    favourite_attraction_ids = []
    if request.user.is_authenticated:
        favourite_tour_ids = list(
            Favourite.objects.filter(user=request.user, tour__isnull=False)
            .values_list('tour_id', flat=True)
        )
        favourite_attraction_ids = list(
            Favourite.objects.filter(user=request.user, attraction__isnull=False)
            .values_list('attraction_id', flat=True)
        )

    attractions = {}
    for tab in tabs:
        tab_items = AttractionTab.objects.filter(tab=tab).select_related('attraction', 'attraction__badge')
        attractions[tab.slug] = {
            'tab': tab,
            'col1': tab_items.filter(column=1).order_by('order'),
            'col2': tab_items.filter(column=2).order_by('order'),
            'col3': tab_items.filter(column=3).order_by('order'),
        }

    return render(request, 'blog/index.html', {
        'carousel_items': carousel_items,
        'tabs': tabs,
        'attractions': attractions,
        'tours': tours,
        'favourite_attraction_ids': favourite_attraction_ids,
        'favourite_tour_ids': favourite_tour_ids,
    })

def plan_your_trip(request):
    tours = Tour.objects.filter(is_active=True).select_related('badge')

    search = request.GET.get('search', '').strip()
    if search:
        tours = tours.filter(title__icontains=search)

    # Фильтр по badge (вместо tour_type)
    badge_ids = request.GET.getlist('badge')
    if badge_ids:
        tours = tours.filter(badge_id__in=badge_ids)

    days_min = request.GET.get('days_min', '').strip()
    days_max = request.GET.get('days_max', '').strip()
    if days_min:
        tours = tours.filter(nights__gte=days_min)
    if days_max:
        tours = tours.filter(nights__lte=days_max)

    price_min = request.GET.get('price_min', '').strip()
    price_max = request.GET.get('price_max', '').strip()
    if price_min:
        tours = tours.filter(price__gte=price_min)
    if price_max:
        tours = tours.filter(price__lte=price_max)

    sort = request.GET.get('sort', 'order')
    sort_map = {
        'price_asc':  'price',
        'price_desc': '-price',
        'nights_asc':   'nights',
        'nights_desc':  '-nights',
        'order':      'order',
    }
    tours = tours.order_by(sort_map.get(sort, 'order'))

    from .models import Badge
    all_badges = TourBadge.objects.all()

    return render(request, 'blog/plan_your_trip.html', {
        'tours':          tours,
        'total':          tours.count(),
        'search':         search,
        'selected_badges': badge_ids,
        'days_min':       days_min,
        'days_max':       days_max,
        'price_min':      price_min,
        'price_max':      price_max,
        'sort':           sort,
        'all_badges':     all_badges,
    })

@login_required
def profile(request):
    return render(request, 'blog/profile.html', {
        'user': request.user,
    })

@login_required
def favourites(request):
    favs = Favourite.objects.filter(
        user=request.user,
        is_deleted=False
    ).select_related('attraction', 'tour').order_by('created_at')
    
    return render(request, 'blog/favourites.html', {'favourites': favs})

@login_required
@require_POST
def toggle_favourite(request, item_type, item_id):
    if item_type == 'attraction':
        lookup = {'user': request.user, 'attraction_id': item_id}
    elif item_type == 'tour':
        lookup = {'user': request.user, 'tour_id': item_id}
    else:
        return JsonResponse({'error': 'Invalid type'}, status=400)

    on_fav_page = request.POST.get('on_fav_page') == 'true'
    fav = Favourite.objects.filter(**lookup).first()

    if fav is None:
        Favourite.objects.create(**lookup)
        return JsonResponse({'status': 'added'})

    if on_fav_page:
        # Страница избранного — soft delete
        if fav.is_deleted:
            fav.is_deleted = False
            fav.deleted_at = None
            fav.save(update_fields=['is_deleted', 'deleted_at'])
            return JsonResponse({'status': 'added'})
        else:
            fav.is_deleted = True
            fav.deleted_at = timezone.now()
            fav.save(update_fields=['is_deleted', 'deleted_at'])
            return JsonResponse({'status': 'removed'})
    else:
        # Главная страница — физическое удаление
        if fav.is_deleted:
            # Была мягко удалена — удаляем и создаём заново с новым created_at
            fav.delete()
            Favourite.objects.create(**lookup)
            return JsonResponse({'status': 'added'})
        else:
            fav.delete()
            return JsonResponse({'status': 'removed'})

@login_required
@csrf_exempt
@require_POST
def clear_favourite_positions(request):
    keys_to_delete = [
        key for key in request.session.keys()
        if key.startswith('fav_created_at_')
    ]

    for key in keys_to_delete:
        del request.session[key]

    request.session.modified = True

    return JsonResponse({'status': 'ok'})
